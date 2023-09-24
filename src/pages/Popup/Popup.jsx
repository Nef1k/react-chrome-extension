import s from './Popup.module.css';
import {useEffect, useState} from "react";

const Popup = () => {
  const [value, setValue] = useState("");

  async function loadValue() {
    const newValue = await chrome.storage.local.get("value");
    setValue(newValue?.value || "");
  }

  useEffect(() => {
    chrome.storage.local.onChanged.addListener(() => {
      loadValue().catch();
    })

    loadValue().catch();
  }, []);

  return (
    <div className={s.wrapper}>
      Current value: <b>{value}</b>
    </div>
  );
}

export default Popup;
