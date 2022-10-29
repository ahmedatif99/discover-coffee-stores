import Head from "next/head";
import Image from "next/image";
import { useState, useEffect, useContext } from "react";

import Banner from "../components/Banner/banner.components";
import Card from "../components/Card/card.components";
import useTrackLocation from "../hooks/use-track-location";
import { fetchCoffeeStores } from "../lib/coffee-stores";

import styles from "../styles/Home.module.css";
import { ACTION_TYPES, StoreContext } from "../store/store.context";

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores();
  return {
    props: {
      coffeeStores,
    },
  };
}

export default function Home(props) {
  const { handleTrackLocation, locationErrorMsg, isFindingLocation } =
    useTrackLocation();

  const [coffeeStoresError, setCoffeeStoresError] = useState(null);

  const { dispatch, state } = useContext(StoreContext);
  const { coffeeStores, latLong } = state;

  const fetchData = async () => {
    const respons = await fetch(
      `/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=30`
    );
    const coffeeStores = await respons.json();
    dispatch({
      type: ACTION_TYPES.SET_COFFEE_STORES,
      payload: { coffeeStores: coffeeStores },
    });
  };

  useEffect(() => {
    if (latLong) {
      try {
        fetchData();
        setCoffeeStoresError("");
      } catch (err) {
        setCoffeeStoresError(err.message);
      }
    }
  }, [latLong]);

  const onBannerButtonClick = () => {
    handleTrackLocation();
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Allows you to find and discover near coffee stores"
        />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? "Locating ..." : "View stores nearby"}
          handleOnClick={onBannerButtonClick}
        />
        {locationErrorMsg && <p>Sth went wrong: {locationErrorMsg}</p>}
        {coffeeStoresError && <p>Sth went wrong: {coffeeStoresError}</p>}
        <div className={styles.heroImage}>
          <Image src="/static/hero.png" alt="Hero" width={700} height={400} />
        </div>
        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores near me</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((data) => {
                return (
                  <Card
                    key={data.id}
                    name={data.name}
                    href={`/coffee-store/${data.id}`}
                    imgUrl={
                      data.imgUrl ||
                      "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                    }
                    className={styles.card}
                  />
                );
              })}
            </div>
          </div>
        )}
        {props.coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Toronto stores</h2>
            <div className={styles.cardLayout}>
              {props.coffeeStores.map((data) => {
                return (
                  <Card
                    key={data.id}
                    name={data.name}
                    href={`/coffee-store/${data.id}`}
                    imgUrl={
                      data.imgUrl ||
                      "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                    }
                    className={styles.card}
                  />
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
