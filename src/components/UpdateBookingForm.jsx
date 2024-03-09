import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import moment from "moment";

function UpdateBooking({ selectedBooking, closeModal }) {
  const [startDateValue, setStartDateValue] = useState(null);
  const [endDateValue, setEndDateValue] = useState(null);

  const [bookingStart, setBookingStart] = useState(
    selectedBooking.bookingStart
      ? moment(selectedBooking.bookingStart)
          .subtract(5, "hours")
          .subtract(30, "minutes")
          .format("YYYY-MM-DDTHH:mm:ss.SSS")
      : ""
  );

  const [bookingEnd, setBookingEnd] = useState(
    selectedBooking.bookingEnd
      ? moment(selectedBooking.bookingEnd)
          .subtract(5, "hours")
          .subtract(30, "minutes")
          .format("YYYY-MM-DDTHH:mm:ss.SSS")
      : ""
  );

  const [name, setName] = useState(selectedBooking.name);
  const [mobileNo, setMobileNo] = useState(selectedBooking.mobileNo);
  const [emailAddress, setEmailAddress] = useState(
    selectedBooking.emailAddress
  );
  const [roomNo, setRoomNo] = useState(selectedBooking.roomNo);
  const [roomType, setRoomType] = useState(selectedBooking.roomType);

  async function handleCheckIn() {
    if (selectedBooking) {
      const advBookingId = selectedBooking.advBookingId;
      const roomNo = selectedBooking.roomNo;
      const updatedBooking = {
        adv_booking_id: advBookingId,
        checkedIn: true,
      };
      fetch("https://advance-booking-api.onrender.com/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBooking),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          alert(`Room No: ${roomNo} - Checked In updated!`);
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Error: " + error.message);
        });

      closeModal();
    } else {
      alert("No booking selected.");
    }
  }

  async function handleInfoUpdate(e) {
    if (selectedBooking) {
      const updatedBooking = {
        adv_booking_id: selectedBooking.advBookingId,
        name: name,
        mobile_no: mobileNo,
        email: emailAddress,

        // start_date: startDateValue,
        // end_date: endDateValue,
        room_no: roomNo,
        room_type: roomType,
        start_date: moment(bookingStart)
          .add(5, "hours")
          .add(30, "minutes")
          .toISOString(),
        end_date: moment(bookingEnd)
          .add(5, "hours")
          .add(30, "minutes")
          .toISOString(),
      };

      // console.log(updatedBooking);
      fetch("https://advance-booking-api.onrender.com/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBooking),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          // Check if the response contains a message
          if (data && data.message) {
            // Alert the message to the user
            // alert("Booking ID: " + data.bookingId + "\n" + data.msg);
            // alert("Booking updated successfully!");
            alert(data.message);
            // console.log("Success:", data);
            window.location.reload(); //reload the window, to diplay new timeline
          }
        })
        .catch((error) => {
          alert("Error: " + error.message);
          console.error("Error:", error);
        });

      closeModal();
    } else {
      alert("No booking selected.");
    }
  }

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div
          style={{
            minWidth: "300px",
            maxWidth: "500px",
            maxHeight: "80vh",
            overflowY: "auto",
            margin: "auto",
          }}
        >
          <div>
            <form
              onSubmit={handleInfoUpdate}
              style={{ width: "400px", margin: "0 auto", textAlign: "center" }}
            >
              <div style={{ marginBottom: "10px", textAlign: "left" }}>
                <label htmlFor="name">Name:</label>
                <br />
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: "90%" }}
                />
              </div>
              <div style={{ marginBottom: "10px", textAlign: "left" }}>
                <label htmlFor="mobileNo">Mobile No:</label>
                <br />
                <input
                  type="text"
                  id="mobileNo"
                  value={mobileNo}
                  onChange={(e) => setMobileNo(e.target.value)}
                  style={{ width: "90%" }}
                />
              </div>
              <div style={{ marginBottom: "10px", textAlign: "left" }}>
                <label htmlFor="emailAddress">Email Address:</label>
                <br />
                <input
                  type="email"
                  id="emailAddress"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  style={{ width: "90%" }}
                />
              </div>
              <div style={{ marginBottom: "10px", textAlign: "left" }}>
                <label htmlFor="bookingStart">Booking Start:</label>
                <br />
                <input
                  type="text"
                  id="bookingStart"
                  value={bookingStart}
                  onChange={(e) => setBookingStart(e.target.value)}
                  style={{ width: "90%" }}
                  disabled
                />
              </div>
              <div style={{ marginBottom: "10px", textAlign: "left" }}>
                <label htmlFor="bookingEnd">Booking End:</label>
                <br />
                <input
                  type="text"
                  id="bookingEnd"
                  value={bookingEnd}
                  onChange={(e) => setBookingEnd(e.target.value)}
                  style={{ width: "90%" }}
                  disabled
                />
              </div>
              <div style={{ marginBottom: "10px", textAlign: "left" }}>
                <label htmlFor="roomNo">Room No:</label>
                <br />
                <input
                  type="text"
                  id="roomNo"
                  value={roomNo}
                  onChange={(e) => setRoomNo(e.target.value)}
                  style={{ width: "90%" }}
                />
              </div>
              <div style={{ marginBottom: "10px", textAlign: "left" }}>
                <label htmlFor="roomType">Room Type:</label>
                <br />
                <select
                  id="roomType"
                  style={{ width: "90%" }}
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                >
                  <option value="Supreme AC">Supreme AC</option>
                  <option value="Semi Suite">Semi Suite</option>
                  <option value="Non AC">Non AC</option>
                  <option value="Regency Suite">Regency Suite</option>
                  <option value="Suite Twin Deluxe">Suite Twin Deluxe</option>
                  <option value="Suite Double Deluxe">
                    Suite Double Deluxe
                  </option>
                  <option value="Family Deluxe Triple">
                    Family Deluxe Triple
                  </option>
                </select>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <div style={{ marginRight: "10px" }}>
                  <DateTimePicker
                    label="Start Date"
                    // value={dayjs(formattedStartDateTime)}
                    value={dayjs(bookingStart)}
                    onChange={(newValue) => {
                      setBookingStart(
                        newValue.format("YYYY-MM-DDTHH:mm:ss.SSS")
                      );
                    }}
                    minutesStep={30}
                  />
                </div>

                <div>
                  <DateTimePicker
                    label="End Date"
                    // value={dayjs(formattedEndDateTime)}
                    value={dayjs(bookingEnd)}
                    onChange={(newValue) => {
                      setBookingEnd(newValue.format("YYYY-MM-DDTHH:mm:ss.SSS"));
                    }}
                    minutesStep={30}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  // marginTop: "2px",
                }}
              >
                <div className="bookingButton">
                  <button onClick={handleCheckIn}>Checked-In</button>
                </div>
                <div className="bookingButton">
                  <button onClick={handleInfoUpdate} type="submit">
                    Update
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </LocalizationProvider>
    </div>
  );
}

export default UpdateBooking;
