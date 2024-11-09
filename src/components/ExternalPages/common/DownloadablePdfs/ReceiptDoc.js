import { Document, Font, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import React from "react";
import gilroySemibold from "../../../../styles/fonts/gilroy/Gilroy-SemiBold.ttf";
import gilroyBold from "../../../../styles/fonts/gilroy/Gilroy-Bold.ttf";
import gilroyMedium from "../../../../styles/fonts/gilroy/Gilroy-Medium.ttf";

const ReceiptDoc = ({
    receiptNo,
    dateOfIssue,
    email,
    creatorName,
    recipientName,
    pickupAddress,
    destinationAddress,
    amount,
    currency,
    shipmentId,
    logo,
}) => {
    Font.register({
        family: "Gilroy",
        fonts: [
            {
                src: gilroyBold,
                fontWeight: "bold",
            },
            {
                src: gilroyMedium,
                fontWeight: "medium",
            },
            {
                src: gilroySemibold,
                fontWeight: "semibold",
            },
        ],
    });

    const styles = StyleSheet.create({
        page: {
            width: "100vw",
        },
        sectionOne: {
            paddingHorizontal: 54,
            paddingTop: 48,
            paddingBottom: 35,
            backgroundColor: "#FAFBFC",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
        },
        receiptTitleText: {
            fontSize: 24,
            fontFamily: "Gilroy",
            fontWeight: "bold",
            marginBottom: 16,
            color: "#061130",
        },
        receiptHeaderText: {
            fontSize: 12,
            fontFamily: "Gilroy",
            fontWeight: "medium",
            color: "#061130",
        },
        ffLogo: {
            width: 83,
        },
        sectionTwo: {
            paddingHorizontal: 54,
            paddingTop: 48,
            flexDirection: "row",
        },
        addressSection: {
            color: "#061130",
            width: "50%",
        },
        addressTitle: {
            fontSize: 12,
            marginBottom: 2,
            fontWeight: "bold",
            fontFamily: "Gilroy",
        },
        addressDetail: {
            width: "60%",
            fontSize: 12,
            fontFamily: "Gilroy",
            fontWeight: "medium",
        },
        amountPaid: {
            paddingHorizontal: 54,
            marginVertical: 58,
        },
        amountPaidText: {
            fontSize: 20,
            fontFamily: "Gilroy",
            fontWeight: "bold",
            color: "#061130",
        },
        tableHead: {
            paddingHorizontal: 54,
            paddingVertical: 8,
            backgroundColor: "#F4F5F7",
            flexDirection: "row",
            justifyContent: "space-between",
            fontSize: 12,
            fontFamily: "Gilroy",
            fontWeight: "semibold",
        },
        tableBody: {
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 54,
            paddingVertical: 8,
            fontFamily: "Gilroy",
            fontWeight: "semibold",
        },
        tableLeftSideText: {
            textAlign: "left",
            fontSize: 12,
        },
        tableRightSideText: {
            textAlign: "right",
            fontSize: 12,
        },
        endingNote: {
            marginTop: 96,
            paddingHorizontal: 54,
        },
        endingNoteTitle: {
            fontSize: 12,
            marginBottom: 2,
            fontWeight: "bold",
            fontFamily: "Gilroy",
        },
        endingNoteText: {
            fontSize: 12,
            fontFamily: "Gilroy",
            fontWeight: "medium",
        },
    });

    return (
        <Document>
            <Page size="A4">
                <View style={styles.sectionOne}>
                    <View>
                        <Text style={styles.receiptTitleText}>Receipt</Text>
                        <View style={styles.receiptHeaderText}>
                            <Text>Receipt number: {receiptNo}</Text>
                            <Text>Date of issue: {dateOfIssue}</Text>
                            <Text>{email}</Text>
                        </View>
                    </View>
                    <View>
                        <Image src={logo} style={styles.ffLogo} />
                    </View>
                </View>
                <View style={styles.sectionTwo}>
                    <View style={styles.addressSection}>
                        <Text style={styles.addressTitle}>Bill-From</Text>
                        <View style={styles.addressDetail}>
                            <Text>{creatorName}</Text>
                            <Text>{pickupAddress}</Text>
                        </View>
                    </View>
                    <View style={styles.addressSection}>
                        <Text style={styles.addressTitle}>Bill-To</Text>
                        <View style={styles.addressDetail}>
                            <Text>{recipientName}</Text>
                            <Text>{destinationAddress}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.amountPaid}>
                    <Text style={styles.amountPaidText}>
                        Amount Paid ({currency}): {amount} {currency}
                    </Text>
                </View>
                <View>
                    <View style={styles.tableHead}>
                        <Text style={styles.tableLeftSideText}>DESCRIPTION</Text>
                        <Text style={styles.tableRightSideText}>AMOUNT</Text>
                    </View>
                    <View style={styles.tableBody}>
                        <Text style={styles.tableLeftSideText}>Shipment ID: {shipmentId}</Text>
                        <Text style={styles.tableRightSideText}>
                            {currency} {amount}
                        </Text>
                    </View>
                </View>
                <View style={styles.endingNote}>
                    <Text style={styles.endingNoteTitle}>Note</Text>
                    <Text style={styles.endingNoteText}>Thanks for your business!</Text>
                    <Text style={styles.endingNoteText}>
                        If you have any questions, contact us at {email}
                    </Text>
                </View>
            </Page>
        </Document>
    );
};

export default ReceiptDoc;
