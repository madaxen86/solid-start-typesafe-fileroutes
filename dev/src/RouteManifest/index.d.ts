// ################################################
// ### THIS FILE IS AUTOGENERATED - DO NOT EDIT ###
// ################################################
export declare function Routes(searchParams?:Record<string, string>):{
    index: string;
    _404: { index: string };
    about: { index: string };
    api: {
      test: { index: string };
    };
    auth: {
      abc: { index: string };
    };
    posts: {
      z: { index: string };
      ooo: {
        slug: (slug:string|number) => ({index: string});
        p: { index: string };
      };
    };
    multiple: {
      third: (third:string|number) => ({
        edit: { index: string };
      });
      first: (first:string|number) => ({
        second: (second:string|number) => ({
          third: (third:string|number) => ({index: string});
        });
      });
    };
};