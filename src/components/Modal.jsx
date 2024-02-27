import React from "react";
import "./Modal.css";

function Modal({ setOpenModal, children }) {
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button
            onClick={() => {
              setOpenModal(false);
            }}
          >
            X
          </button>
        </div>
        <div className="body">{children}</div>

        <div className="footer">
          {/* <button
            className="cancelButton"
            onClick={() => {
              setOpenModal(false);
            }}
            id="cancelBtn"
          >
            Cancel
          </button> */}
        </div>
      </div>
    </div>
  );
}

export default Modal;
