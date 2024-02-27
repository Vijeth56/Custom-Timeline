import React, { useState, useEffect } from "react";
import axios from "axios";
import Timeline from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";
import moment from "moment";

function Customtimeline() {
  const [roomDetails, setRoomDetails] = useState([]);
  const [advanceBookings, setAdvanceBookings] = useState([]);

  useEffect(() => {
    fetchRoomDetails();
    fetchAdvanceBookings();
  }, []);

  const fetchRoomDetails = async () => {
    try {
      const result = await axios("http://localhost:8000/rooms");
      // const result = await axios(
      //   "https://advance-booking-api-production.up.railway.app/rooms"
      // );

      const formattedData = result.data.map((room, index) => ({
        id: room.room_no,
        title: `Room ${room.room_no}`,
      }));
      setRoomDetails(formattedData);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAdvanceBookings = async () => {
    try {
      // const result = await axios("http://localhost:8000/advancebookings");
      const result = await axios(
        "https://advance-booking-api.onrender.com/advancebookings"
      );

      setAdvanceBookings(result.data);
    } catch (err) {
      console.error(err);
    }
  };

  const groups = roomDetails;

  // console.log(advanceBookings);
  const fD = advanceBookings.map((item, index) => ({
    id: item.adv_booking_id,
    group: item.room_no,
    title: item.name,
    start_time: moment(item.booking_start)
      .subtract(5, "hours")
      .subtract(30, "minutes"),
    end_time: moment(item.booking_end)
      .subtract(5, "hours")
      .subtract(30, "minutes"),
    // start_time: moment(item.booking_start),
    // end_time: moment(item.booking_end),

    canMove: false,
    canResize: false,
    canChangeGroup: false,
    itemProps: {
      onDoubleClick: async () => {
        let roomInfo = {};
        for (let i = 0; i < advanceBookings.length; i++) {
          if (advanceBookings[i].adv_booking_id === item.adv_booking_id) {
            roomInfo = advanceBookings[i];
            break;
          }
        }
        if (Object.keys(roomInfo).length === 0)
          alert("No additional details found.");
        else {
          const formattedData = `Name: ${roomInfo.name}\nMobile No: ${
            roomInfo.mobile_no
          }\nEmail Address: ${
            roomInfo.email_address
          }\nBooking Start: ${formatDate(
            roomInfo.booking_start
          )}\nBooking End: ${formatDate(roomInfo.booking_end)}\nRoom No: ${
            roomInfo.room_no
          }\nRoom Type: ${roomInfo.room_type}`;

          function formatDate(inputDate) {
            const date = new Date(inputDate);
            date.setHours(date.getHours() - 5);
            date.setMinutes(date.getMinutes() - 30);
            return date.toLocaleString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            });
          }
          // const formattedData = `Name: ${roomInfo.name}\nMobile No: ${roomInfo.mobile_no}\nEmail Address: ${roomInfo.email_address}\nBooking Start: ${roomInfo.booking_start}\nBooking End: ${roomInfo.booking_end}\nRoom No: ${roomInfo.room_no}\nRoom Type: ${roomInfo.room_type}`;
          alert(formattedData);
        }
      },
    },
  }));

  // console.log(fD);
  const items = fD;

  // -5:30

  return (
    <div className="App">
      <Timeline
        groups={groups}
        items={items}
        defaultTimeStart={moment().add(-12, "hour")}
        defaultTimeEnd={moment().add(12, "hour")}
      />
    </div>
  );
}

export default Customtimeline;
