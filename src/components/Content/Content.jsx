import s from './Content.module.css';

const Content = () => {
  return (
    <div style={{width: "128px", backgroundColor: "white"}}>
      <h1>This is a component injected by a content script</h1>
      <p>Have fun!</p>
    </div>
  );
}

export default Content;
