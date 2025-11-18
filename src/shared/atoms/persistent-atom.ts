import { atom, PrimitiveAtom } from "jotai";
import storage from "../util/storage";

const atomWithAsyncStorage = <T>(key: string) => {
  const baseAtom = atom() as PrimitiveAtom<T>;

  baseAtom.onMount = (setValue) => {
    (async () => {
      const item = await storage.getItem(key);
      setValue(JSON.parse(item as string) ?? {});
    })();
  };

  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update) => {
      const nextValue =
        typeof update === "function" ? update(get(baseAtom)) : update;
      set(baseAtom, nextValue);
      storage.setItem(key, JSON.stringify(nextValue));
    }
  );

  return derivedAtom;
};

export default atomWithAsyncStorage;
