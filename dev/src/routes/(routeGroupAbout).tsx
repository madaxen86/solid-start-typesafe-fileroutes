import { ParentComponent } from 'solid-js';
const Layout: ParentComponent = props => {
  return <main>{props.children}</main>;
};
export default Layout;
