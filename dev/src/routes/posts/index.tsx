import { useNavigate, useSearchParams } from '@solidjs/router';
import { Routes } from '~/RouteManifest';

export default () => {
  const [search, setSearch] = useSearchParams();
  const nav = useNavigate();

  const sp = new URLSearchParams(Object.entries(search).map(([k, v]) => [k, (v || '').toString()]));
  search && nav(Routes().index);
  return <>asda</>;
};
