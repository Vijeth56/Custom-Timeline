import React, { useState, useEffect } from "react";
import axios from "axios";
import Timeline from "react-calendar-timeline";
import Modal from "./Modal";
import UpdateBooking from "./UpdateBookingForm";
import "react-calendar-timeline/lib/Timeline.css";
import moment from "moment";

function Customtimeline() {
  const [roomDetails, setRoomDetails] = useState([]);
  const [advanceBookings, setAdvanceBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchRoomDetails();
    fetchAdvanceBookings();
  }, []);

  const fetchRoomDetails = async () => {
    try {
      // const result = await axios("http://localhost:8000/rooms");
      const result = await axios(
        "https://advance-booking-api.onrender.com/rooms"
      );

      const formattedData = result.data.map((room, index) => ({
        id: room.room_no,
        title: room.description,
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
      console.log(result.data);
      setAdvanceBookings(result.data);
    } catch (err) {
      console.error(err);
    }
  };

  const closeModal = () => {
    setSelectedBooking(null);
  };

  const groups = roomDetails;

  // console.log(advanceBookings);
  const items = advanceBookings.map((item, index) => ({
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
          const formattedData = {
            checkedIn: roomInfo.checked_in,
            advBookingId: roomInfo.adv_booking_id,
            name: roomInfo.name,
            mobileNo: roomInfo.mobile_no,
            emailAddress: roomInfo.email_address,
            bookingStart: roomInfo.booking_start,
            bookingEnd: roomInfo.booking_end,
            roomNo: roomInfo.room_no,
            roomType: roomInfo.room_type,
            address: roomInfo.booking_address,
            city: roomInfo.booking_city,
          };

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
          // alert(formattedData);
          // console.log(formattedData);
          setSelectedBooking(formattedData);
        }
      },
    },
  }));

  useEffect(() => {
    // console.log(selectedBooking);
  }, [selectedBooking]);

  // -5:30

  return (
    <div className="App">
      {selectedBooking && (
        <Modal setOpenModal={closeModal}>
          <UpdateBooking
            selectedBooking={selectedBooking}
            closeModal={closeModal}
          />
        </Modal>
      )}
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
