import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getRoutes } from './utils';
type TreeNode = {
  type: 'static' | 'param';
  index?: boolean;
  children: Record<string, TreeNode>;
};

type Tree = Record<string, TreeNode>;

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const targertDir = 'src/RouteManifest';

// Ensure the .route directory exists
function ensureRouteDirectory() {
  const dir = path.join(__dirname, targertDir);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

// Function to build the route tree from segments
function buildRouteTree(routes: string[]) {
  const tree: Tree = {};

  routes.forEach(route => {
    const segments = route.split('/').filter(Boolean); // Ignore empty parts
    let currentNode: any = tree;

    segments.forEach((segment, index) => {
      // Prefeix numbers with _ =>
      segment = segment.replace(/^\:?\*?([0-9]+)$/g, '_$1');
      const isParam = segment.startsWith(':');
      const isLastPart = index === segments.length - 1;

      // Determine the key: parameterized routes or static segments
      const key = isParam ? segment.slice(1) : segment;

      if (!currentNode[key]) {
        currentNode[key] = isParam
          ? { type: 'param', children: {} }
          : { type: 'static', children: {} };
      }

      if (isLastPart) {
        currentNode[key].index = true; // Mark this as the final part of the route
      }

      currentNode = currentNode[key].children; // Traverse deeper
    });
  });

  return tree;
}

// Function to convert the route tree into the desired function string
function buildRoutesFromTree(tree: Tree, parentPath = '', depth = 2) {
  const outputJS: string[] = [];
  const outputDTS: string[] = [];
  const indent = '  '.repeat(depth);

  for (const key in tree) {
    const node = tree[key];
    if (!node) throw new Error('Node not found');
    if (node.type === 'static') {
      const fullPath = `${parentPath}/${key}`; // Construct full path by appending the parent path
      // Static route, if it's an index route
      if (node.index) {
        outputJS.push(`${indent}${key}: { index: \`${fullPath}\${query}\` },`);
        outputDTS.push(`${indent}${key}: { index: string };`);
      }

      // Traverse children for nested static routes
      if (Object.keys(node.children).length > 0) {
        outputJS.push(`${indent}${key}: {`);
        outputDTS.push(`${indent}${key}: {`);

        const [contentJS, contentDTS] = buildRoutesFromTree(node.children, fullPath, depth + 1);
        if (contentJS) outputJS.push(contentJS);
        if (contentDTS) outputDTS.push(contentDTS);

        outputJS.push(`${indent}},`);
        outputDTS.push(`${indent}};`);
      }
    }

    if (node.type === 'param') {
      const fullPath = `${parentPath}/\${${key}\}`; // Construct full path by appending the parent path
      // Dynamic route parameter

      // Traverse children for nested dynamic routes
      if (Object.keys(node.children).length > 0) {
        outputJS.push(`${indent}${key}: (${key}) => ({`);
        outputDTS.push(`${indent}${key}: (${key}:string|number) => ({`);

        if (node.index) {
          outputJS.push(`${indent}  index: \`${fullPath}\${query}\`,`);
          outputDTS.push(`${indent}  index: string;`);
        }

        const [contentJS, contentDTS] = buildRoutesFromTree(node.children, fullPath, depth + 1);
        if (contentJS) outputJS.push(contentJS);
        if (contentDTS) outputDTS.push(contentDTS);

        outputJS.push(`${indent}}),`);
        outputDTS.push(`${indent}});`);
      } else {
        // dynamic tail
        outputJS.push(`${indent}${key}: (${key}) => ({index: \`${fullPath}\${query}\`}),`);
        outputDTS.push(`${indent}${key}: (${key}:string|number) => ({index: string});`);
      }
    }
  }

  return [outputJS.join('\n'), outputDTS.join('\n')];
}

// Function to generate the entire Routes function
async function generateRoutesFunction(customRoutes: string[]) {
  const fileRoutes = await getRoutes();
  const routes = [...fileRoutes, ...customRoutes];
  console.log('routes', routes);
  const tree = buildRouteTree(routes); // Build the tree from routes

  const outputJS = [];
  const outputDTS = [];

  outputJS.push('// ################################################');
  outputJS.push('// ### THIS FILE IS AUTOGENERATED - DO NOT EDIT ###');
  outputJS.push('// ################################################');
  outputJS.push('export function Routes(searchParams) {');
  outputJS.push(
    "  const query = searchParams ? '?' + new URLSearchParams(searchParams).toString() : '';",
  );
  outputJS.push('  return {');
  // Add top-level index route ("/")
  outputJS.push('    index: `/${query}` ,');

  outputDTS.push('// ################################################');
  outputDTS.push('// ### THIS FILE IS AUTOGENERATED - DO NOT EDIT ###');
  outputDTS.push('// ################################################');
  outputDTS.push('export declare function Routes(searchParams?:Record<string, string>):{');
  outputDTS.push('    index: string;');

  // Generate routes from the tree
  const [contentJS, contentDTS] = buildRoutesFromTree(tree);
  outputJS.push(contentJS); // Convert tree to function string
  outputDTS.push(contentDTS);

  outputJS.push('  };');
  outputJS.push('}');
  // outputJS.push('');
  // outputJS.push('module.exports = { Routes };');

  outputDTS.push('};');

  return [outputJS.join('\n'), outputDTS.join('\n')];
}

// Function to write the JS file
async function generateJSFile(routes: string[]) {
  const jsFilePath = path.join(__dirname, targertDir, 'index.js');
  const dtsFilePath = path.join(__dirname, targertDir, 'index.d.ts');

  const [routesFunctionString, typeDeclarationString] = await generateRoutesFunction(routes);

  if (!routesFunctionString) throw new Error('Could not create Routes funnction');
  fs.writeFileSync(jsFilePath, routesFunctionString, 'utf-8');

  if (!typeDeclarationString)
    throw new Error('Could not create type declaration for Routes function');
  fs.writeFileSync(dtsFilePath, typeDeclarationString, 'utf-8');

  console.log(`Generated ${jsFilePath}`);
}

// Main function to generate the route manifest
async function generateRouteManifest(routes: string[] = []) {
  ensureRouteDirectory();
  await generateJSFile(routes);
}

export { generateRouteManifest, generateRoutesFunction };
