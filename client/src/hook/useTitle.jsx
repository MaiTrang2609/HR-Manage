import { useEffect } from "react";

const useTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title + " - HR Manage";

    return () => (document.title = prevTitle);
  }, [title]);
};

export default useTitle;
