import { rateActions } from "actions";
import { debounce } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ProductInput = ({ productValue, handleSelection, required }) => {
    const [searchProduct, setSearchProduct] = useState(productValue);
    const [dropdown, setDropdown] = useState(false);
    const [product, setProduct] = useState("");
    const dispatch = useDispatch();
    const ref = useRef();

    const { getProductsLoading, getProductsSuccess } = useSelector((state) => state.rate);

    useEffect(() => {
        dispatch(rateActions.fetchProducts(product));
    }, [dispatch, product]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target) && dropdown) {
                setDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, dropdown]);

    return (
        <div ref={ref} className=" w-full relative">
            <div onClick={() => setDropdown(true)}>
                <input
                    value={searchProduct}
                    type="text"
                    className="border bg-white cursor-pointer rounded outline-0 w-full h-[48px] px-4 py-3 text-sm font-rocGroteskMedium placeholder:text-mvx-neutral placeholder:font-rocGroteskMedium"
                    placeholder="Enter origin"
                    name="origin"
                    required={required}
                    onInput={debounce((evt) => {
                        setProduct(evt.target.value);
                    }, 800)}
                    onChange={(e) => setSearchProduct(e.target.value)}
                />
            </div>

            {dropdown && (
                <div className="absolute z-10 overflow-hidden py-2 w-full bg-white rounded shadow-[0px_0px_4px_rgba(0,0,0,0.04),0px_4px_32px_rgba(0,0,0,0.06)]">
                    {/* <div className="px-6 pt-6">
                        <p className="text-sm font-rocGroteskBold mb-4">Products</p>
                    </div> */}
                    <div className="pb-3 w-full max-h-[275px] overflow-y-auto">
                        {getProductsLoading ? (
                            <p className="text-sm text-center pl-6 font-rocGroteskMedium">
                                Loading products...
                            </p>
                        ) : getProductsSuccess?.products &&
                          getProductsSuccess?.products?.length > 0 ? (
                            getProductsSuccess?.products?.map((value) => {
                                return (
                                    <div
                                        key={value?._id}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDropdown(false);
                                            handleSelection?.(value.Description, value.productCode);
                                            setSearchProduct(value?.Description);
                                            setProduct("");
                                        }}
                                        className="flex items-center gap-6 hover:bg-mvx-light-blue py-2.5 px-4 cursor-pointer"
                                    >
                                        <div className="flex items-center w-full">
                                            <div className="flex items-center w-full justify-between gap-8">
                                                <p className="text-sm">{value?.Description}</p>
                                                <p className="text-sm text-mvx-neutral ">
                                                    {String(value?.productCode)?.slice(0, 4)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-sm text-center pl-6 font-rocGroteskMedium">
                                No Product Found
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductInput;
