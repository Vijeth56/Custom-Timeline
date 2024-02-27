import "./App.css";
import React, { useState } from "react";
import Customtimeline from "./components/Customtimeline";
import Calender from "./components/Calender";
import Modal from "./components/Modal";
import BookingForm from "./components/BookingForm";
import { FormThemeProvider } from "react-form-component";

function App() {
  const [calenderModalOpen, calenderSetModalOpen] = useState(false);
  const [formModalOpen, formSetModalOpen] = useState(false);

  return (
    <div className="App">
      <div className="headerCol">
        {/* <div className="calenderButton">
          <button
            onClick={() => {
              calenderSetModalOpen(true);
            }}
          >
            Calender
          </button>
        </div> */}
        <div className="bookingButton">
          <button
            onClick={() => {
              formSetModalOpen(true);
            }}
          >
            Create Booking
          </button>
        </div>
      </div>

      {calenderModalOpen && (
        <Modal setOpenModal={calenderSetModalOpen}>
          <Calender />
        </Modal>
      )}
      {formModalOpen && (
        <Modal setOpenModal={formSetModalOpen}>
          <FormThemeProvider>
            <BookingForm setOpenModal={formSetModalOpen} />
          </FormThemeProvider>
        </Modal>
      )}
      <div
        style={{ margin: "auto", width: "fit-content", marginTop: "1rem" }}
      ></div>
      <Customtimeline />
      {/* <Calender /> */}
    </div>
  );
}

export default App;
