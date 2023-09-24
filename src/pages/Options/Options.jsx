import s from './Options.module.css';
import {useEffect, useState} from "react";

const Options = () => {
  const [value, setValue] = useState("");

  async function handleSave(newValue) {
    await chrome.storage.local.set({"value": newValue});
  }

  async function loadValue() {
    const newValue = await chrome.storage.local.get("value");
    setValue(newValue?.value || "");
  }

  useEffect(() => {
    loadValue().catch();
  }, []);

  return (
    <div className={s.wrapper}>
      <input
        placeholder="Some value"
        value={value}
        onChange={(e) => {setValue(e.target.value)}}
      />
      <br />
      <button
        onClick={() => {handleSave(value).catch()}}
      >Save</button>
    </div>
  );
}

export default Options;
