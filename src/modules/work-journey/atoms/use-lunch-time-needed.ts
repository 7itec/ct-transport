import {atom, useAtom} from 'jotai';

const lunchTimeNeededAtom = atom(false);

const useLunchTimeNeeded = () => {
  const [lunchTimeNeeded, setLunchTimeNeeded] = useAtom(lunchTimeNeededAtom);

  return {lunchTimeNeeded, setLunchTimeNeeded};
};

export default useLunchTimeNeeded;
