import { useState } from "react";
import { formatAddressShort, copyToClipBoard } from "../lib/utilities";

const AddressButton = ({ address }) => {
  const [isCopied, setIsCopied] = useState(false);

  return (
    <div className="tooltip">
      <div
        className="py-1 px-3 bg-purple-100 rounded-full mr-1 md:mr-2 hover:bg-purple-200 transition-all text-xs mt-1 text-purple-500"
        style={{ cursor: "pointer" }}
        key={address}
        onMouseOut={() => {
          setTimeout(function () {
            setIsCopied(false);
          }, 3000);
        }}
        onClick={() => {
          setIsCopied(true);
          copyToClipBoard(address);
        }}
      >
        {formatAddressShort(address)}
      </div>
      <span
        style={
          isCopied
            ? { fontSize: 12, opacity: 0.9, width: 70 }
            : { fontSize: 12, opacity: 0.9, width: 100 }
        }
        className="tooltip-text bg-black p-3 -mt-12 rounded text-white"
      >
        {isCopied ? "Copied!" : "Copy address"}
      </span>
    </div>
  );
};

export default AddressButton;
