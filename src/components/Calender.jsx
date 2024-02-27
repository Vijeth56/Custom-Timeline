import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function Calender() {
  const [value, onChange] = useState(new Date());
  const [advanceBookings, setAdvanceBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    fetchAdvanceBookings();
  }, []);

  const fetchAdvanceBookings = async () => {
    try {
      const result = await axios("http://localhost:8000/advancebookings");
      setAdvanceBookings(result.data);
      setIsLoading(false); // Set loading state to false when data is fetched
    } catch (err) {
      console.error(err);
    }
  };

  async function handleCalenderAlert(date) {
    const selectedDate = date;
    const bookings = advanceBookings;

    function parseDate(dateString) {
      const [day, month, year] = dateString.split("-").map(Number);
      return new Date(year, month - 1, day);
    }

    function checkDateOverlap(dateString, rangeStartString, rangeEndString) {
      const date = parseDate(dateString);
      const rangeStart = parseDate(rangeStartString);
      const rangeEnd = parseDate(rangeEndString);

      const dateTimestamp = date.getTime();
      const startTimestamp = rangeStart.getTime();
      const endTimestamp = rangeEnd.getTime();

      return dateTimestamp >= startTimestamp && dateTimestamp <= endTimestamp;
    }

    const bookingDetails = bookings.map((booking) => ({
      booking_start: booking.booking_start
        .substring(0, 10)
        .split("-")
        .reverse()
        .join("-"),
      booking_end: booking.booking_end
        .substring(0, 10)
        .split("-")
        .reverse()
        .join("-"),
      room_type: booking.room_type,
    }));

    const totalRoomTypeMap = new Map();
    const partialRoomTypeMap = new Map();

    const checkInMap = new Map();
    const checkOutMap = new Map();

    let totalAllocatedRooms = 0;
    let partiallyAllocatedRooms = 0;

    bookingDetails.forEach((booking) => {
      const roomType = booking.room_type;
      const inputDate = selectedDate;
      const rangeStartDate = booking.booking_start;
      const rangeEndDate = booking.booking_end;

      if (checkDateOverlap(inputDate, rangeStartDate, rangeEndDate)) {
        if (inputDate === rangeStartDate || inputDate === rangeEndDate) {
          // checking for same day checkin and checkout
          if (inputDate === rangeStartDate && inputDate === rangeEndDate) {
            if (partialRoomTypeMap.has(roomType)) {
              partialRoomTypeMap.set(
                roomType,
                partialRoomTypeMap.get(roomType) + 1
              );
            } else {
              partialRoomTypeMap.set(roomType, 1);
            }
            checkInMap.set(roomType, partialRoomTypeMap.get(roomType));
            checkOutMap.set(roomType, partialRoomTypeMap.get(roomType));
          } else if (inputDate === rangeStartDate) {
            if (partialRoomTypeMap.has(roomType)) {
              partialRoomTypeMap.set(
                roomType,
                partialRoomTypeMap.get(roomType) + 1
              );
            } else {
              partialRoomTypeMap.set(roomType, 1);
            }
            checkInMap.set(roomType, partialRoomTypeMap.get(roomType));
          } else if (inputDate === rangeEndDate) {
            if (partialRoomTypeMap.has(roomType)) {
              partialRoomTypeMap.set(
                roomType,
                partialRoomTypeMap.get(roomType) + 1
              );
            } else {
              partialRoomTypeMap.set(roomType, 1);
            }
            checkOutMap.set(roomType, partialRoomTypeMap.get(roomType));
          }
          partiallyAllocatedRooms++;
        }

        if (totalRoomTypeMap.has(roomType)) {
          totalRoomTypeMap.set(roomType, totalRoomTypeMap.get(roomType) + 1);
        } else {
          totalRoomTypeMap.set(roomType, 1);
        }
        totalAllocatedRooms++;
      }
    });

    let consoleMessage = "";
    if (totalRoomTypeMap.size === 0) {
      consoleMessage = "All rooms are available on " + selectedDate;
    } else {
      consoleMessage = "Allocated rooms:\n";
      totalRoomTypeMap.forEach((count, roomType) => {
        consoleMessage += `${roomType}: ${count}\n`;
      });
      consoleMessage += `Total Allocated Rooms: ${totalAllocatedRooms}\n`;
    }

    if (partialRoomTypeMap.size > 0) {
      consoleMessage += "\nPartially allocated rooms:\n";
      consoleMessage += "Check-In\n";
      if (checkInMap.size > 0) {
        checkInMap.forEach((count, roomType) => {
          consoleMessage += `${roomType}: ${count}\n`;
          bookings
            .filter(
              (booking) =>
                booking.room_type === roomType &&
                parseDate(booking.booking_start.substring(0, 10)).getTime() ===
                  parseDate(selectedDate).getTime()
            )
            .forEach((booking) => {
              consoleMessage += `  - ${booking.name} - Room No. ${booking.room_no}\n`;
              consoleMessage += `    Check-In Date: ${selectedDate}\n`;
            });
        });
      } else {
        consoleMessage += "No check-ins for this date.\n";
      }

      consoleMessage += "Check-Out\n";
      if (checkOutMap.size > 0) {
        checkOutMap.forEach((count, roomType) => {
          consoleMessage += `${roomType}: ${count}\n`;
          bookings
            .filter(
              (booking) =>
                booking.room_type === roomType &&
                parseDate(booking.booking_end.substring(0, 10)).getTime() ===
                  parseDate(selectedDate).getTime()
            )
            .forEach((booking) => {
              consoleMessage += `  - ${booking.name} - Room No. ${booking.room_no}\n`;
              consoleMessage += `    Check-Out Date: ${selectedDate}\n`;
            });
        });
      } else {
        consoleMessage += "No check-outs for this date.\n";
      }
      consoleMessage += `Total Partially Allocated Rooms: ${partiallyAllocatedRooms}\n`;
    }

    // console.log(consoleMessage);
    alert(consoleMessage);
  }

  return (
    <div>
      {isLoading ? ( // Conditionally render loading indicator
        <div>Loading...</div>
      ) : (
        <Calendar
          onChange={onChange}
          value={value}
          onClickDay={(value) => {
            const day = value.getDate();
            const month = value.getMonth() + 1;
            const year = value.getFullYear();

            const formattedDate = `${day < 10 ? "0" : ""}${day}-${
              month < 10 ? "0" : ""
            }${month}-${year}`;
            handleCalenderAlert(formattedDate);
          }}
        />
      )}
    </div>
    // <Calendar
    //   onChange={onChange}
    //   value={value}
    //   onClickDay={(value) => {
    //     const day = value.getDate();
    //     const month = value.getMonth() + 1;
    //     const year = value.getFullYear();

    //     const formattedDate = `${day < 10 ? "0" : ""}${day}-${
    //       month < 10 ? "0" : ""
    //     }${month}-${year}`;
    //     handleCalenderAlert(formattedDate);
    //   }}
    // />
  );
}

export default Calender;
