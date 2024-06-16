import { useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect } from "react";
import * as NProgress from "nprogress";

export const useTopLoaderRouter = () => {
  const router = useRouter();
  const pathname = usePathname();

  const customPush = useCallback(
    (url: string) => {
      NProgress.start();

      router.push(url);
    },
    [router]
  );

  useEffect(() => {
    NProgress.done();
  }, [pathname]);

  return {
    ...router,
    push: customPush,
  };
};
