import {Alert, Avatar, Box, CircularProgress, Link, Rating, Stack, Tooltip, Typography} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import {Link as RouterLink, useParams} from "react-router-dom";
import {HighlightButton} from "../components/buttons/highlight_button";
import {StandardButton} from "../components/buttons/standard_button";
import {Star} from "@mui/icons-material";
import * as React from "react";
import {useEffect, useState} from "react";
import {getContent} from "../redux/actions";
import {connect, useSelector} from "react-redux";
import UserService from "../services/userService";


/**
 * Detailed view that conveys the most important information of a content item.
 *
 * @return {JSX.Element}
 */
function Details(props) {
    // Match url id to content item.
    const {id} = useParams();
    const singleContent = useSelector((state) => {
        return state.singleContent;
    });

    // Retrieve current signed-in user from redux state.
    const user = useSelector((state) => {
        return state.user;});

    // Retrieve author of content item.
    const [author, setAuthor] = useState(null);

    // Function to fetch username from service.
    async function fetchUser() {
        return await UserService.userdata(singleContent.content.ownerId);
    }

    // Retrieve if buying should be enabled.
    function enablePurchase(){
        return user.hasOwnProperty("user") && user.user.hasOwnProperty("role") && user.user.role === "customer";
    }

    // Trigger retrieval of states and backend data.
    useEffect(() => {
        if (!singleContent.content) {
            props.dispatch(props.getContent(id))
        } else {
            fetchUser().then((res) => {
                setAuthor(res)
            });
        }
    }, [singleContent.content]);

    return (!singleContent.content && !singleContent.error) || author == null ? (
        // Loading content.
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
            <CircularProgress/>
        </Box>
    ) : singleContent.error ? (
        <Alert severity="error">Loading content went wrong, sorry!</Alert>
    ) : (
        <Stack spacing={3} marginBottom={10} marginTop={5}>
            <Stack direction="row" justifyContent="space-between">
                <Carousel
                    animation="slide"
                    interval={6000}
                    duration={1200}
                    indicators={false}
                    navButtonsAlwaysVisible={true}
                    height="60vh"
                    sx={{
                        width: {xs: "100%", md: "100%", lg: "60%", xl: "60%"},
                        borderRadius: 5,
                        boxShadow: 5,
                    }}
                >
                    {singleContent.content.media.map((data, index) => (
                        <img
                            width="100%"
                            height="100%"
                            key={index}
                            src={data}
                            style={{objectFit: "cover"}}
                        />
                    ))}
                </Carousel>
                <Box
                    justifyContent="center"
                    sx={{display: {xs: "none", md: "none", lg: "flex"}, width: "35%"}}
                >
                    <Stack alignItems="center" justifyContent="center">
                        <Link underline="none" href={`/profile/${singleContent.content.ownerId}`}>
                            <Avatar
                                sx={{
                                    width: "15vw",
                                    height: "15vw",
                                    marginBottom: 3,
                                    boxShadow: 5,
                                    ":hover": {
                                        opacity: 0.8,
                                        boxShadow: 15,
                                    },
                                }}
                                alt="content creator"
                                src={author.profilePicture}
                            />
                        </Link>
                        <Stack>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                spacing={3}
                                marginTop={0.5}
                                marginBottom={2}
                            >
                                <Rating
                                    size="large"
                                    sx={{
                                        "& .MuiRating-iconEmpty": {color: "info.main"},
                                        "& .MuiRating-iconFilled": {color: "warning.main"},
                                    }}
                                    name="read-only"
                                    value={author.avgReviewRating}
                                    readOnly
                                    emptyIcon={<Star fontSize="inherit"/>}
                                />
                                <Link
                                    color="inherit"
                                    underline="hover"
                                    href={`/profile/${singleContent.content.ownerId}`}
                                >
                                    {author.reviews.length} reviews
                                </Link>
                            </Stack>
                            <Typography variant="h1">{author.firstname + " " + author.lastname}</Typography>
                            <Typography lineHeight={1.3}>{author.title}</Typography>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
            <Stack
                spacing={4}
                sx={{width: {xs: "100%", md: "100%", lg: "60%", xl: "60%"}}}
            >
                <Stack>
                    <Stack direction="row" justifyContent="space-between" spacing={4}>
                        <Typography variant="h1">{singleContent.content.title}</Typography>
                        <Typography variant="h1">{singleContent.content.price}€</Typography>
                    </Stack>
                    <Stack
                        marginBottom={2}
                        direction="row"
                        justifyContent="space-between"
                        spacing={4}
                    >
                        <Typography>
                            by{" "}
                            <Link
                                color="inherit"
                                underline="hover"
                                href={`/profile/${singleContent.content.ownerId}`}
                            >
                                {author.firstname + " " + author.lastname}
                            </Link>
                        </Typography>
                        <Typography>total price</Typography>
                    </Stack>
                    <Tooltip title={enablePurchase() ? "" : "Please sign-in as a customer to buy content!"} placement="right">
                        <div style={{width: "110px"}}>
                        <HighlightButton
                            disabled={!enablePurchase()}
                            variant="contained"
                            component={RouterLink}
                            to={`/payment/${id}`}
                        >
                            Buy now
                        </HighlightButton>
                        </div>
                    </Tooltip>
                </Stack>
                <Stack spacing={1}>
                    <Typography variant="h3">Description</Typography>
                    <Typography>{singleContent.content.description}</Typography>
                </Stack>
                <Stack spacing={1}>
                    <Typography variant="h3">Duration</Typography>
                    <Typography>{singleContent.content.duration} weeks with {" "}
                        {singleContent.content.intensity} {singleContent.content.category === "nutrition" ? ("meals per day") : ("sessions per week")}</Typography>
                </Stack>
                <Stack spacing={2}>
                    <Typography variant="h3">Sample Workout</Typography>
                    <StandardButton
                        variant="contained"
                        href={singleContent.content.sample}
                        download={singleContent.content.title}
                    >
                        Download
                    </StandardButton>
                </Stack>
            </Stack>
        </Stack>
    );
}

const mapDispatchToProps = (dispatch) => ({
    getContent, dispatch
});

// Connect() establishes the connection to the redux functionalities.
export default connect(null, mapDispatchToProps)(Details);
