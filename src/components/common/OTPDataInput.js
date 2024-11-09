import useScreenSize from "hooks/useScreenSize";
import OtpInput from "react18-input-otp";

const OTPDataInput = ({ otp, setOTP }) => {
    const screenSize = useScreenSize();
    const below450 = screenSize < 450;
    const below400 = screenSize < 400;

    return (
        <OtpInput
            id="otpInput"
            containerStyle={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                margin: "0 auto",
            }}
            inputStyle={{
                background: "white",
                border: "1px solid #dfe1e6",
                boxShadow: "3px 2px 2px rgba(0, 0, 0, 0.02)",
                height: below400 ? "40px" : below450 ? "45px" : "50px",
                width: below400 ? "34px" : below450 ? "39px" : "47px",
                borderRadius: "6px",
                fontSize: "18px",
                color: "black",
                fontWeight: "500",
                textTransform: "uppercase",
                margin: below400 ? "0 6px" : "0 8px",
            }}
            // focusStyle={{ border: "2px solid #061130" }}
            value={otp}
            onChange={(value) => {
                setOTP(value);
            }}
            numInputs={6}
        />
    );
};

export default OTPDataInput;
