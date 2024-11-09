import { lazy } from "react";
const Blog = lazy(() => import("components/ExternalPages/Landing/Blog"));
const Article = lazy(() => import("components/ExternalPages/Landing/Article"));
const Home2 = lazy(() => import("components/ExternalPages/Landing/Home2"));
const ContactUs = lazy(() => import("components/ExternalPages/Landing/ContactUs"));
const About2 = lazy(() => import("components/ExternalPages/Landing/About2"));
const CaseStudy = lazy(() => import("components/ExternalPages/Landing/CaseStudy"));
const ResourcesPage = lazy(() => import("components/ExternalPages/Landing/ResourcesPage"));
const RevolutionizingLogistics = lazy(() =>
    import("components/ExternalPages/Landing/BlogPosts/RevolutionizingLogistics")
);
const MasteringLogistics = lazy(() =>
    import("components/ExternalPages/Landing/BlogPosts/MasteringLogistics")
);
const SecureFreightManagement = lazy(() =>
    import("components/ExternalPages/Landing/BlogPosts/SecureFreightManagement")
);
const StreamlinedForFreight = lazy(() =>
    import("components/ExternalPages/Landing/BlogPosts/StreamlinedForFreight")
);
const FeaturesPage = lazy(() => import("components/ExternalPages/Landing/FeauturesPage"));
const Login = lazy(() => import("components/Auth/Login"));
const SignUp = lazy(() => import("components/Auth/SignUp"));
const ResetPassword = lazy(() => import("components/Auth/ResetPassword"));
const OnboardGFF = lazy(() => import("components/OnboardGFF"));
const ShipmentRequest = lazy(() => import("components/OnboardGFF/ShipmentRequest"));
const CreateQuote = lazy(() => import("components/OnboardGFF/CreateQuote"));
const Profile = lazy(() => import("components/ExternalPages/Profile"));
const RequestQuote = lazy(() => import("components/ExternalPages/RequestQuote"));
const AcceptRejectQuote = lazy(() => import("components/ExternalPages/AcceptRejectQuote"));
const Payment = lazy(() => import("components/ExternalPages/Payment"));
const PaymentSuccess = lazy(() => import("components/ExternalPages/PaymentSuccess"));
const Receipt = lazy(() => import("components/ExternalPages/Receipt"));
const MessagingLink = lazy(() => import("components/ExternalPages/MessagingLink"));
const Tracking = lazy(() => import("components/ExternalPages/Tracking"));
const MovementDetails = lazy(() => import("components/ExternalPages/Tracking/MovementDetails"));
const RateFreightForwarder = lazy(() => import("components/ExternalPages/RateFreightForwarder"));
const SearchTrackingNo = lazy(() => import("components/ExternalPages/searchTrackingNo"));
const Reviews = lazy(() => import("components/ExternalPages/Reviews"));
const Onboarding = lazy(() => import("components/Onboarding"));
const Dashboard = lazy(() => import("components/Dashboard"));
const Folders = lazy(() => import("components/Folders"));
const ShipmentCreation = lazy(() => import("components/ShipmentCreation"));
const ShipmentList = lazy(() => import("components/Shipment/ShipmentList"));
const SingleQuote = lazy(() => import("components/ExternalPages/SingleQuote"));
const QuotesList = lazy(() => import("components/Quotes/QuotesList"));
const QuotesListNew = lazy(() => import("components/Quotes/QuotesListNew"));
const QuoteRequests = lazy(() => import("components/Quotes/QuoteRequests"));
const Settings = lazy(() => import("components/Settings"));
const CreateQuoteCustomer = lazy(() => import("components/Quotes/CreateQuoteCustomer"));
const CreateQuotesV2 = lazy(() => import("components/Quotes/CreateQuoteV2/CreateQuotesNew"));
const EditApprovalQuote = lazy(() => import("components/Quotes/ApprovalQuotes/EditApprovalQuotes"));
const PreviewApprovalQuote = lazy(() =>
    import("components/Quotes/ApprovalQuotes/PreviewApprovalQuotes")
);
const Referral = lazy(() => import("components/Referral"));
const InstantQuotes = lazy(() => import("components/Quotes/InstantQuotes/InstantQuotes"));
const InstantQuoteSearchResult = lazy(() => import("components/Quotes/InstantQuotes/SearchResult"));
const InstantQuoteDetail = lazy(() => import("components/Quotes/InstantQuotes/InstantQuoteDetail"));
const AddRate = lazy(() => import("components/RateManagement/AddRate"));
const RateManagement = lazy(() => import("components/RateManagement"));
const FAQs = lazy(() => import("components/ExternalPages/Landing/FAQs"));
const ShipmentDetails = lazy(() => import("components/ShipmentDetails"));
const CookiePolicy = lazy(() => import("components/ExternalPages/Landing/CookiePolicy"));

const routes = [
    // {
    //     path: "/beta",
    //     component: <Landing />,
    // },
    // {
    //     path: "/waitlist",
    //     component: <WaitList />,
    // },
    // TO BE REMOVED
    {
        path: "/",
        component: <Home2 />,
    },
    // {
    //     path: "/home2",
    //     component: <Home2 />,
    // },
    {
        path: "/contact-us",
        component: <ContactUs />,
    },
    {
        path: "/about",
        component: <About2 />,
    },
    // {
    //     path: "/about",
    //     component: <About />,
    // },
    {
        path: "/case-study",
        component: <CaseStudy />,
    },
    {
        path: "/resources",
        component: <ResourcesPage />,
    },
    {
        path: "/resources/revolutionizing-logistics",
        component: <RevolutionizingLogistics />,
    },
    {
        path: "/resources/mastering-logistics",
        component: <MasteringLogistics />,
    },
    {
        path: "/resources/secure-freight-management",
        component: <SecureFreightManagement />,
    },
    {
        path: "/resources/secure-freight-management",
        component: <SecureFreightManagement />,
    },
    {
        path: "/resources/streamlined-for-freight-forwarders",
        component: <StreamlinedForFreight />,
    },
    // {
    //     path: "/resources/:resourceId",
    //     component: <SingleResourcePage />,
    // },
    {
        path: "/features",
        component: <FeaturesPage />,
    },
    {
        path: "/blog",
        component: <Blog />,
    },
    {
        path: "/blog/:cat/:articleId",
        component: <Article />,
    },
    {
        path: "faqs",
        component: <FAQs />,
    },
    {
        path: "/cookie-policy",
        component: <CookiePolicy />,
    },
    {
        path: "/login",
        component: <Login />,
    },
    {
        path: "/register",
        component: <SignUp />,
    },
    {
        path: "/reset-password",
        component: <ResetPassword />,
    },
    { name: "OnboardGFF Global Fright Forwarder", path: "/onboard-gff", component: <OnboardGFF /> },
    {
        name: "OnboardGFF Global Fright Forwarder Quote",
        path: "/quote-request",
        component: <ShipmentRequest />,
    },
    {
        name: "OnboardGFF Global Fright Forwarder Create Quote",
        path: "/create-quote",
        component: <CreateQuote />,
    },
    {
        name: "Profile",
        path: "profile/:ffid",
        component: <Profile />,
    },
    {
        name: "Request Quote",
        path: "request-quote/:ffid",
        component: <RequestQuote />,
    },
    {
        name: "Accept Reject Quote",
        path: "accept-reject-quote/:quoteId",
        component: <AcceptRejectQuote />,
    },
    {
        name: "Payment",
        path: "payment/:paymentId",
        component: <Payment />,
    },
    {
        name: "Payment Success",
        path: "payment-success/:paymentId",
        component: <PaymentSuccess />,
    },
    {
        name: "Receipt",
        path: "receipt/:id",
        component: <Receipt />,
    },
    {
        name: "Messaging Link",
        path: "messaging-link/:shipmentId",
        component: <MessagingLink />,
    },
    {
        name: "Tracking",
        path: "tracking/:shipmentId",
        component: <Tracking />,
    },
    {
        name: "Movement Tracking",
        path: "tracking/:shipmentId/:movementId",
        component: <MovementDetails />,
    },
    {
        name: "Freight Rate",
        path: "rate-freight-forwarder/:shipmentId",
        component: <RateFreightForwarder />,
    },
    {
        name: "Tracking Search",
        path: "search-tracking-number/:ffid",
        component: <SearchTrackingNo />,
    },
    {
        name: "Reviews",
        path: "reviews/:ffid",
        component: <Reviews />,
    },
    {
        name: "Onboarding",
        path: "onboarding",
        component: <Onboarding />,
    },
    {
        parent: "dashboard",
        name: "Dashboard",
        path: "home",
        component: <Dashboard />,
    },
    {
        parent: "dashboard",
        name: "Folders",
        path: "folders",
        component: <Folders />,
    },
    {
        parent: "dashboard",
        name: "Create Shipment",
        path: "shipment-creation/:id",
        component: <ShipmentCreation />,
    },
    {
        parent: "dashboard",
        name: "Shipment Details",
        path: "shipment/:shipmentId",
        component: <ShipmentDetails />,
    },
    {
        parent: "dashboard",
        name: "Shipment List",
        path: "shipments",
        component: <ShipmentList />,
    },
    {
        name: "Single Quote",
        path: "single-quote/:quoteId",
        component: <SingleQuote />,
    },
    {
        parent: "dashboard",
        name: "Quote List",
        path: "quotes/v2",
        component: <QuotesList />,
    },
    {
        parent: "dashboard",
        name: "Quote List",
        path: "quotes",
        component: <QuotesListNew />,
    },
    {
        parent: "dashboard",
        name: "Quote Requests",
        path: "quote-requests",
        component: <QuoteRequests />,
    },
    {
        parent: "dashboard",
        name: "Settings",
        path: "settings",
        component: <Settings />,
    },
    {
        parent: "dashboard",
        name: "Create Quote For Customer",
        path: "create-quote/customer/:shipmentId",
        component: <CreateQuoteCustomer />,
    },
    {
        parent: "dashboard",
        name: "Create Quotes",
        path: "create-quote/v2",
        component: <CreateQuotesV2 />,
    },
    {
        parent: "dashboard",
        name: "Edit Quote",
        path: "quotes/approval/edit/:quoteId",
        component: <EditApprovalQuote />,
    },
    {
        parent: "dashboard",
        name: "Edit Quote",
        path: "quotes/approval/view/:quoteId",
        component: <PreviewApprovalQuote />,
    },
    {
        parent: "dashboard",
        name: "Referral",
        path: "referral",
        component: <Referral />,
    },

    {
        parent: "dashboard",
        name: "Instant Quote",
        path: "instant-quote",
        component: <InstantQuotes />,
    },
    {
        parent: "dashboard",
        name: "Instant Quote Search Result",
        path: "instant-quote/search-result",
        component: <InstantQuoteSearchResult />,
    },
    {
        parent: "dashboard",
        name: "Instant Quote Detail Page",
        path: "instant-quote/:instantQuoteId",
        component: <InstantQuoteDetail />,
    },
    {
        parent: "dashboard",
        name: "Add Rate",
        path: "rate-management/add-rate",
        component: <AddRate />,
    },
    {
        parent: "dashboard",
        name: "Rate Management",
        path: "rate-management",
        component: <RateManagement />,
    },
];

export default routes;
