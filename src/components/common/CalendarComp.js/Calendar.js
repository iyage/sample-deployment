import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./styles.css";

const CustomCalendar = ({ showDoubleView, value, onChange }) => {
    return (
        <div>
            <Calendar
                showDoubleView={showDoubleView}
                calendarType="US"
                view="month"
                onChange={onChange}
                selectRange={showDoubleView}
                value={value}
            />
        </div>
    );
};

export default CustomCalendar;
