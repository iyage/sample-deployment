import React from "react";
import { Text, View } from "@react-pdf/renderer";
import formatCurrency from "helpers/formatCurrency";

const Items = ({ itemList }) => (
    <>
        <View
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#F4F5F7",
                borderRadius: "3px",
                padding: "0 2",
                fontWeight: "semibold",
                margin: "12px 0 0",
                height: 26,
            }}
        >
            <Text style={{ fontSize: 10, flexBasis: "53%" }}>ITEM</Text>
            <Text
                style={{
                    fontSize: 10,
                    flexBasis: "15%",
                    textAlign: "center",
                    borderRight: "1px solid #DFE1E6",
                    borderLeft: "1px solid #DFE1E6",
                }}
            >
                CURRENCY
            </Text>

            <Text style={{ fontSize: 10, flexBasis: "32%", textAlign: "center" }}>AMOUNT</Text>
        </View>

        {itemList.map((item, idx) => (
            <View
                key={idx + item.name}
                style={{
                    display: "flex",
                    flexDirection: "row",
                    padding: "0 2 4",
                    fontWeight: "semibold",
                    lineHeight: 1.5,
                    fontSize: 10,
                    border: "1px solid #DFE1E6",
                    borderTop: 0,
                    minHeight: "auto",
                }}
            >
                <Text
                    style={{
                        flexBasis: "53%",
                        padding: "15 4 0 2",
                    }}
                >
                    {item.name}
                </Text>
                <Text
                    style={{
                        flexBasis: "15%",
                        borderRight: "1px solid #DFE1E6",
                        borderLeft: "1px solid #DFE1E6",
                        padding: "15 0 7",
                        textAlign: "center",
                    }}
                >
                    {item.currency}
                </Text>

                <Text
                    style={{
                        flexBasis: "32%",
                        padding: "15 2 0 4",
                        textAlign: "center",
                    }}
                >
                    {formatCurrency(item.price)}
                </Text>
            </View>
        ))}
    </>
);

export default Items;
