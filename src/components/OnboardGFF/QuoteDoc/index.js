import React from "react";
import { Document, Font, Image, Page, Text, View } from "@react-pdf/renderer";
import gilroySemibold from "styles/fonts/gilroy/Gilroy-SemiBold.ttf";
import gilroyBold from "styles/fonts/gilroy/Gilroy-Bold.ttf";
import gilroyMedium from "styles/fonts/gilroy/Gilroy-Medium.ttf";
import Items from "./Items";
import formatCurrency from "helpers/formatCurrency";

const QuoteDoc = (props) => {
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

    const isItemsListValid = (list) => {
        return list
            .map((obj) => {
                const requiredSections = Object.keys(obj).filter((key) => key !== "currency");
                return requiredSections.map((key) => obj[key]).join("");
            })
            .filter((list) => list).length;
    };

    return (
        <Document>
            <Page
                size="A4"
                style={{
                    width: "100vw",
                    fontSize: 12,
                    fontFamily: "Gilroy",
                    padding: "30 50",
                }}
            >
                <View
                    style={{
                        marginBottom: "50px",
                        position: "relative",
                        padding: "0 0 80",
                        display: "flex",
                    }}
                >
                    <Image
                        src={
                            "https://firebasestorage.googleapis.com/v0/b/mvxchange-fb-staging.appspot.com/o/relayApp%2Fcreate-quote-pdf-logo.jpg?alt=media&token=edde97ae-b2c4-45ee-8b95-3dc72233cea1"
                        }
                        style={{ width: 82, height: 80, margin: "8 auto 0 0" }}
                    />

                    <View
                        style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            // marginLeft: "auto",
                            width: "50%",
                            fontWeight: "medium",
                        }}
                    >
                        <Text style={{ fontSize: 11, padding: "8 0 6", fontWeight: "bold" }}>
                            Bill-From
                        </Text>
                        <Text style={{ lineHeight: 1.5, margin: " 2 0 0" }}>
                            {props?.billFromBusinessName}
                        </Text>
                        <Text style={{ lineHeight: 1.5, margin: " 2 0 0" }}>
                            {props?.billFromAddress}
                        </Text>
                    </View>

                    <View
                        style={{
                            position: "absolute",
                            top: 95,
                            right: 0,
                            // marginLeft: "auto",
                            width: "50%",
                            fontWeight: "medium",
                        }}
                    >
                        <Text style={{ fontSize: 11, padding: "8 0 6", fontWeight: "bold" }}>
                            Bill-To
                        </Text>
                        <Text style={{ lineHeight: 1.5, margin: " 2 0 0" }}>
                            {props?.billToBusinessName}
                        </Text>
                        <Text style={{ lineHeight: 1.5, margin: " 2 0 0" }}>
                            {props?.billToAddress}
                        </Text>
                    </View>
                </View>

                <>
                    <SectionHeaders text={"Date"} />
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            margin: "12 0 0",
                            fontWeight: "medium",
                        }}
                    >
                        <TitleValueSection title={"Issued date"} value={props?.issueDate} />
                        <TitleValueSection
                            title={"Due date"}
                            basisValue={"53%"}
                            value={props?.dueDate}
                        />
                    </View>
                </>

                <View
                    style={{
                        margin: "0 0 46",
                    }}
                >
                    <SectionHeaders text={"Trip Details"} />

                    {/* Trip Details */}
                    {[
                        ["Country of Supply", props?.countryOfSupply],
                        ["Pickup Address", props?.pickupAddress],
                        ["Port of Loading", props?.portOfLoading],
                        ["Port of Destination", props?.portOfDestination],
                        ["Load Type", props?.loadType],
                        ["Incoterms Type", props?.incoterms],
                    ].map(([title, value], idx) => (
                        <View
                            key={idx}
                            style={{
                                display: "flex",
                                alignContent: "center",
                                justifyContent: "space-between",
                                padding: "6 2",
                                fontWeight: "semibold",
                                borderBottom: "1px solid #DFE1E6",
                            }}
                        >
                            <Text style={{ width: "47%", transform: "translateY(12px)" }}>
                                {title}
                            </Text>
                            <Text
                                style={{
                                    color: "#6B778C",
                                    width: "53%",
                                    margin: "0 0 8 auto",
                                    transform: "translateY(-4px)",
                                    lineHeight: 1.5,
                                }}
                            >
                                {value}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Shipment Details */}
                <>
                    <SectionHeaders text={"Shipment Details"} />

                    <View
                        style={{
                            border: "1px solid #DFE1E6",
                            borderRadius: 2,
                            margin: "16 0 0",
                            padding: "15 13",
                        }}
                    >
                        <View style={{ fontWeight: "semibold" }}>
                            {props?.shipmentList.map((item, idx) => (
                                <PackageContainerList
                                    isContainers={props?.isContainers}
                                    data={item}
                                    moreThanOneItem={props.shipmentList.length > 1}
                                    key={item._id}
                                    idx={idx}
                                />
                            ))}
                            <Text style={{ margin: "20px 0 8px", fontSize: 13 }}>
                                Goods Details
                            </Text>

                            <View style={{ display: "flex", flexDirection: "row" }}>
                                <Text>Value of Goods:</Text>
                                <Text style={{ color: "#6B778C", margin: "0 0 0 5" }}>
                                    {props?.goodsDetails?.value?.currency}
                                    {formatCurrency(props?.goodsDetails?.value?.amount)}
                                </Text>
                            </View>
                            <View
                                style={{
                                    margin: "10px 0 0",
                                    display: "flex",
                                    flexDirection: "row",
                                }}
                            >
                                <Text>Description:</Text>
                                <Text style={{ color: "#6B778C", margin: "0 0 0 5" }}>
                                    {props?.goodsDetails?.description}
                                </Text>
                            </View>
                            <View
                                style={{
                                    margin: "10px 0 0",
                                    display: "flex",
                                    flexDirection: "row",
                                }}
                            >
                                <Text>Status of readiness:</Text>
                                <Text style={{ color: "#6B778C", margin: "0 0 0 5" }}>
                                    {props?.goodsDetails?.goodsStatus}
                                </Text>
                            </View>
                        </View>
                    </View>
                </>

                {isItemsListValid(props.customCharges) ? (
                    <View>
                        <SectionHeaders text={"Customs Charges"} />
                        <Items itemList={props.customCharges} />
                    </View>
                ) : (
                    ""
                )}

                {isItemsListValid(props.exportCharges) ? (
                    <View>
                        <SectionHeaders text={"Export Charges"} />
                        <Items itemList={props.exportCharges} />
                    </View>
                ) : (
                    ""
                )}

                {isItemsListValid(props.importCharges) ? (
                    <View>
                        <SectionHeaders text={"Import Charges"} />
                        <Items itemList={props.importCharges} />
                    </View>
                ) : (
                    ""
                )}

                {isItemsListValid(props.EXWCharges) ? (
                    <View>
                        <SectionHeaders text={"EXW Charges"} />
                        <Items itemList={props.EXWCharges} />
                    </View>
                ) : (
                    ""
                )}

                {props.terms ? (
                    <>
                        <SectionHeaders text={"Terms and Conditions"} />
                        <TitleValueSection title={""} value={props.terms} />
                    </>
                ) : (
                    ""
                )}
            </Page>
        </Document>
    );
};

const SectionHeaders = ({ text }) => (
    <View
        style={{
            backgroundColor: "#F4F5F7",
            borderRadius: "3px",
            padding: "8 18 8 2",
            fontWeight: "semibold",
            margin: "25px 0 0",
        }}
    >
        <Text>{text}</Text>
    </View>
);

const TitleValueSection = ({ title, value, basisValue }) => (
    <View
        style={{
            flexBasis: basisValue ?? "45%",
            fontWeight: "medium",
        }}
    >
        <Text style={{ fontSize: 11, padding: "8 0 6", fontWeight: "bold" }}>{title}</Text>
        <Text
            style={{
                margin: "2 0 0",
                lineHeight: 1.5,
            }}
        >
            {value}
        </Text>
    </View>
);

const PackageContainerList = ({ data, isContainers, moreThanOneItem, idx }) => {
    return (
        <View>
            <Text style={{ margin: "15px 0 6px", fontSize: 13, fontWeight: "semibold" }}>
                {isContainers ? "Container" : "Package"} {moreThanOneItem ? idx + 1 : ""}
            </Text>

            {isContainers ? (
                <View style={{ padding: "4px 0 12px", fontWeight: "semibold", lineHeight: 1.5 }}>
                    <View style={{ display: "flex", flexDirection: "row" }}>
                        <Text>Container type:</Text>
                        <Text style={{ color: "#6B778C", margin: "0 0 0 5" }}>
                            {data.containerType}
                        </Text>
                    </View>
                    <View style={{ margin: "10px 0 0", display: "flex", flexDirection: "row" }}>
                        <Text>Unit:</Text>
                        <Text style={{ color: "#6B778C", margin: "0 0 0 5" }}>{data.unit}</Text>
                    </View>
                    <View style={{ margin: "10px 0 0", display: "flex", flexDirection: "row" }}>
                        <Text>Quantity: </Text>{" "}
                        <Text style={{ color: "#6B778C", margin: "0 0 0 5" }}>{data.quantity}</Text>
                    </View>
                </View>
            ) : (
                <View style={{ padding: "4px 0 12px", fontWeight: "semibold", lineHeight: 1.5 }}>
                    <View style={{ display: "flex", flexDirection: "row" }}>
                        <Text>Package type:</Text>
                        <Text style={{ color: "#6B778C", margin: "0 0 0 5" }}>
                            {data.packageType}
                        </Text>
                    </View>
                    <View style={{ margin: "10px 0 0", display: "flex", flexDirection: "row" }}>
                        <Text>Number of units:</Text>
                        <Text style={{ color: "#6B778C", margin: "0 0 0 5" }}>{data.units}</Text>
                    </View>
                    <View style={{ margin: "10px 0 0", display: "flex", flexDirection: "row" }}>
                        <Text> Dimensions (per unit):</Text>
                        <Text style={{ color: "#6B778C", margin: "0 0 0 5" }}>
                            Length: {data.length.value}
                            {data.length.unit} x Width: {data.width.value}
                            {data.width.unit} x Height: {data.height.value}
                            {data.height.unit}
                        </Text>
                    </View>
                    <View style={{ margin: "10px 0 0", display: "flex", flexDirection: "row" }}>
                        <Text>Weight (per unit):</Text>
                        <Text style={{ color: "#6B778C", margin: "0 0 0 5" }}>
                            {data.weight.value}
                            {data.weight.unit}
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );
};

export default QuoteDoc;
