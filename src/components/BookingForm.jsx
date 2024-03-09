import React, { useState } from "react";
import Form, { Input, Select, FormButton } from "react-form-component";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import moment from "moment";

const BookingForm = ({ setOpenModal }) => {
  const [startDateValue, setStartDateValue] = useState(null);
  const [endDateValue, setEndDateValue] = useState(null);

  function handleSubmit(fields) {
    if (startDateValue && endDateValue) {
      const startDateTime = new Date(startDateValue.$d);
      const endDateTime = new Date(endDateValue.$d);

      if (endDateTime > startDateTime) {
        const formData = {
          name: fields.name,
          mobile_no: fields["mobile_no."],
          email: fields.email,
          room_type: fields.room_type,
          no_of_rooms: fields.no_of_rooms,
          room_no: fields["room_no."],
          // start_date: startDateTime.toISOString(),
          // end_date: endDateTime.toISOString(),
          start_date: moment(startDateTime)
            .add(5, "hours")
            .add(30, "minutes")
            .toISOString(),
          end_date: moment(endDateTime)
            .add(5, "hours")
            .add(30, "minutes")
            .toISOString(),
        };

        // console.log(formData);
        fetch("https://advance-booking-api.onrender.com/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            // alert("Booking ID: " + data.bookingId + "\n" + data.msg);
            let alertMessage = "";
            if (data.bookingId) {
              alertMessage += "Booking ID: " + data.bookingId + "\n";
            }
            alertMessage += data.msg;
            alert(alertMessage);
            console.log("Success:", data);
            window.location.reload(); //reload the window, to diplay new timeline
          })
          .catch((error) => {
            alert("Error: " + error.message);
            console.error("Error:", error);
          });
      } else {
        alert("End Date must be after Start Date");
        // console.error("End Date must be after Start Date");
      }
    } else {
      alert("Please select both Start Date and End Date");
      // console.error("Please select both Start Date and End Date");
    }

    setOpenModal(false);
  }

  return (
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
        <Form
          fields={[
            "name",
            "mobile_no.",
            "email",
            "room_type",
            "no_of_rooms",
            "room_no.",
          ]}
          style={{ fontFamily: "Arial, sans-serif", fontSize: "16px" }}
        >
          <Input name="name" label="Name" />
          <Input name="mobile_no." label="Mobile no." />
          <Input name="email" type="email" label="E-mail" />
          <Select
            name="room_type"
            label="Room type"
            options={[
              "Supreme AC",
              "Semi Suite",
              "Non AC",
              "Regency Suite",
              "Suite Twin Deluxe",
              "Suite Double Deluxe",
              "Family Deluxe Triple",
            ]}
          />
          <Input name="no_of_rooms" label="No. of Rooms" />
          {/* <Input name="room_no." label="Room no." /> */}
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
                value={startDateValue}
                onChange={(newValue) => {
                  setStartDateValue(newValue);
                }}
                minutesStep={30}
                minDate={dayjs().add(1, "day").startOf("day")}
              />
            </div>

            <div>
              <DateTimePicker
                label="End Date"
                value={endDateValue}
                onChange={(newValue) => {
                  setEndDateValue(newValue);
                }}
                minutesStep={30}
                minDate={dayjs().add(1, "day").startOf("day")}
              />
            </div>
          </div>

          <FormButton onClick={handleSubmit}>Save</FormButton>
        </Form>
      </div>
    </LocalizationProvider>
  );
};

export default BookingForm;
