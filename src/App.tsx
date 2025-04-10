import { useEffect, useRef, useState } from 'react';
import './App.css';

interface NumButtonProps {
  number: number | string;
  addLetter: (letter: string, isOper: boolean) => void;
  setIsLastOper: (isOper: boolean) => void;
  IsLastOper: boolean;
  IsOper: boolean;
  setWasPoint: (WasPoint: boolean) => void;
}

function NumButton({ number, addLetter, setIsLastOper, IsLastOper, IsOper, setWasPoint}: NumButtonProps) {

  function add() {
    if (!(IsOper && IsLastOper)) {
      addLetter(String(number), IsOper);
      setIsLastOper(IsOper);
      if(IsOper){
        setWasPoint(false);
      }
    }
  }

  return (
    <button onClick={add} data-key={number}>
      {number}
    </button>
);
}

interface MinusButtonProps {
  number: number;
  addLetter: (letter: string, isOper: boolean) => void;
  setIsLastOper: (isOper: boolean) => void;
  IsLastOper: boolean;
  setWasPoint: (WasPoint: boolean) => void;
}

function MinusButton({ number, addLetter, setIsLastOper, IsLastOper, setWasPoint}: MinusButtonProps) {

  function add() {
    if (!IsLastOper || number === 0) {
      addLetter("-", true);
      setIsLastOper(true);
      setWasPoint(false);
    }
  }

  return (
    <>
      <button onClick={add} data-key="-">
        -
      </button>
    </>
  );
}

interface CleanButtonProps {
  setCount: (count: string) => void;
  setIsLastOper: (isOper: boolean) => void;
  setWasPoint: (WasPoint: boolean) => void;
}

function CleanButton({ setCount, setIsLastOper, setWasPoint}: CleanButtonProps) {
  function set() {
    setCount("");
    setIsLastOper(true);
    setWasPoint(false);
  }
  return (
    <>
      <button onClick={set} data-key="c">
        C
      </button>
    </>
  );
}

interface ResultButtonProps {
  count: string;
  IsLastOper: boolean;
  addResult: (result: string) => void;
}

function ResultButton({ count, IsLastOper, addResult }: ResultButtonProps) {
  const [Count, setCount] = useState("");
  function result() {
    try {
      if (!IsLastOper) {
        // eslint-disable-next-line
        const result:number = eval(count);
        if(!Number.isFinite(result)){
          throw new Error();
        }
        setCount(String(result));
        addResult(count + "=" + result);
      }
    }
    catch (e:any) {
      const str = "Ошибка!";
      console.error(str);
      addResult(str);
      setCount(str);

      const button = document.querySelector(`button[data-key="c"]`);
      if (button) {
        (document.querySelector(`button[data-key="c"]`) as HTMLButtonElement).click();
      }
    }
  }

  return (
    <>
      <h1>{Count}</h1>
      <button onClick={result} data-key="=">
        =
      </button>
    </>
  );
}

function ChangeTema() {
  const [isLight, setIsLight] = useState(true);

  function change(){
    const body = document.body;
    
    body.removeAttribute("id");
    if(isLight){
      body.id = 'dark';
    }
    else{
      body.id = 'light';
    }
    setIsLight(!isLight);
  }

  return(
    <button onClick={change}>Сменить тему</button>
  );
}

interface IButtonPoint{
  wasPoint:boolean;
  setWasPoint:(b:boolean)=>void;
  addLetter: (letter: string, isOper: boolean) => void;
}

function ButtonPoint({wasPoint,setWasPoint, addLetter}:IButtonPoint){
  function point(){
    if(!wasPoint){
      setWasPoint(true);
      addLetter(".", false);
    }
  }

  return (
    <button onClick={point}  data-key=".">.</button>
  )
}

function App() {
  const [count, setCount] = useState("");
  const [isLastOper, setIsLastOper] = useState(true);
  const [wasPoint, setWasPoint] = useState(false);

  const [result, setResult] = useState<string[]>([]);
  const appRef = useRef(null);

  function addResult(params: string) {
    setResult([...result, params]);
  }

  function addLetter(params: string, IsOper: boolean) {
    setCount(count + params);
    setIsLastOper(IsOper);
  }

  const buttons = [];
  for (let i = 0; i <= 9; i++) {
    buttons.push(<NumButton key={i} number={i} addLetter={addLetter} setIsLastOper={setIsLastOper} IsLastOper={isLastOper} IsOper={false} setWasPoint={setWasPoint}/>);
  }

  const operators = ["+", "*", "/"];
  const operatorButtons = operators.map(op => (
    <NumButton key={op} number={op} addLetter={addLetter} setIsLastOper={setIsLastOper} IsLastOper={isLastOper} IsOper={true} setWasPoint={setWasPoint}/>
  ));

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const key = event.key;
      const button = document.querySelector(`button[data-key="${key}"]`);
      
      if (button) {
        (button as HTMLButtonElement).click();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="App" ref={appRef}>
      <ChangeTema/>
      <ResultButton count={count} IsLastOper={isLastOper} addResult={addResult} />
      <h1>{count}</h1>
      {buttons}
      <ButtonPoint wasPoint={wasPoint} setWasPoint={setWasPoint} addLetter={addLetter}/>
      {operatorButtons}
      <MinusButton number={count.length} addLetter={addLetter} setIsLastOper={setIsLastOper} IsLastOper={isLastOper} setWasPoint={setWasPoint}/>
      <CleanButton setCount={setCount} setIsLastOper={setIsLastOper} setWasPoint={setWasPoint}/>
      {result.map((res, index) => (
        <h2 key={index}>{res}</h2>
      ))}
    </div>
  );
}


export default App;
