.details {
    min-height: 100vh;
    background-color: #F6F1F8;
    padding: 25px 50px 60px;
    color: #49345E;
}

.detailsNavbar {
    width: 100%;
    margin-bottom: 25px;
    border-bottom: 1px solid #E6D9ED;
}

.back {
    width: 42px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #E6D9ED;
    border-radius: 50%;
    background-color: #FFFFFF;
    color: #49345E;
    font-size: 22px;
    cursor: pointer;
    margin-bottom: 20px;
    transition: 0.2s;
}

.back:hover {
    background-color: #49345E;
    color: #FFFFFF;
}

.details > h1 {
    color: #49345E;
    font-size: 32px;
    font-weight: 800;
    margin: 15px 0 8px;
}

.details > p {
    color: #75647F;
    font-size: 15px;
    line-height: 1.6;
    margin: 5px 0;
}

.gallery {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    grid-template-rows: 220px 220px;
    gap: 12px;
    max-width: 1200px;
    margin: 30px auto;
    overflow: hidden;
    border-radius: 16px;
}

.gallery img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.gallery img:first-child {
    grid-row: span 2;
}

.details > h2 {
    color: #49345E;
    font-size: 22px;
    font-weight: 800;
    margin-top: 30px;
    margin-bottom: 12px;
}

.details > hr {
    border: none;
    border-top: 1px solid #E6D9ED;
    margin: 40px 0;
}

.room {
    max-width: 1100px;
    margin: 15px auto;
    padding: 25px;
    background-color: #FFFFFF;
    border: 1px solid #E6D9ED;
    border-radius: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 30px;
    box-sizing: border-box;
    transition: 0.2s;
}

.room:hover {
    border-color: #B99ACB;
    box-shadow: 0 6px 20px rgba(73, 52, 94, 0.08);
}

.room h2 {
    color: #49345E;
    font-size: 20px;
    font-weight: 800;
    margin-bottom: 10px;
}

.room p {
    color: #75647F;
    font-size: 14px;
    line-height: 1.6;
    margin: 7px 0;
}

.roomPrice {
    min-width: 170px;
    text-align: right;
    padding-left: 20px;
    border-left: 1px solid #E6D9ED;
}

.roomPrice h2 {
    color: #49345E;
    font-size: 24px;
    margin: 0;
}

.roomPrice p {
    margin: 2px 0 15px;
    color: #75647F;
}

.bookButton {
    border: none;
    background-color: #49345E;
    color: #FFFFFF;
    padding: 11px 22px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: 0.2s;
}

.bookButton:hover {
    background-color: #75647F;
}

.details > div:last-child {
    max-width: 1100px;
    margin-left: auto;
    margin-right: auto;
}

.review {
    max-width: 900px;
    margin: 15px auto;
    padding: 20px 24px;
    background-color: #FFFFFF;
    border: 1px solid #E6D9ED;
    border-radius: 12px;
}

.review h2 {
    color: #49345E;
    font-size: 17px;
    margin: 5px 0;
}

.review p {
    color: #75647F;
    line-height: 1.6;
    margin: 10px 0;
}

.review span {
    color: #9A8AA3;
    font-size: 12px;
}

@media (max-width: 900px) {
    .details {
        padding: 20px 25px 50px;
    }

    .gallery {
        grid-template-columns: 2fr 1fr;
        grid-template-rows: 220px 160px;
    }

    .gallery img:first-child {
        grid-row: span 2;
    }

    .room {
        align-items: flex-start;
    }
}

@media (max-width: 650px) {
    .details {
        padding: 15px 14px 40px;
    }

    .details > h1 {
        font-size: 26px;
    }

    .gallery {
        display: flex;
        flex-direction: column;
        height: auto;
    }

    .gallery img {
        height: 220px;
    }

    .room {
        flex-direction: column;
        padding: 20px;
    }

    .roomPrice {
        width: 100%;
        border-left: none;
        border-top: 1px solid #E6D9ED;
        padding-left: 0;
        padding-top: 18px;
        text-align: left;
    }

    .bookButton {
        width: 100%;
    }
}
