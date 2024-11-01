// ################################################
// ### THIS FILE IS AUTOGENERATED - DO NOT EDIT ###
// ################################################
export function Routes(searchParams) {
  const query = searchParams ? '?' + new URLSearchParams(searchParams).toString() : '';
  return {
    index: `/${query}` ,
    _404: {index: `/_404${query}`},
    routeSlash: {index: `/route-slash${query}`},
    about: {index: `/about${query}`},
    api: {
      test: {index: `/api/test${query}`},
    },
    auth: {
      abc: {index: `/auth/abc${query}`},
    },
    posts: {
     index: `/posts${query}`,
      z: {index: `/posts/z${query}`},
      ooo: {
        slug: (slug) => ({index: `/posts/ooo/${slug}${query}`}),
        p: {index: `/posts/ooo/p${query}`},
      },
    },
    multiple: {
      third: (third) => ({
        edit: {index: `/multiple/${third}/edit${query}`},
      }),
      first: (first) => ({
        second: (second) => ({
          third: (third) => ({index: `/multiple/${first}/${second}/${third}${query}`}),
        }),
      }),
    },
  };
}