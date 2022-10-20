import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { useContext, useState, useEffect } from "react";
import useSWR from "swr";

import cls from "classnames";
import Spinner from "../../components/spinner/spinner.components";

import { fetchCoffeeStores } from "../../lib/coffee-stores";
import { StoreContext } from "../../store/store.context";
import { isEmpty, fetcher } from "../../utils";

import styles from "../../styles/coffee-store.module.css";

export async function getStaticProps(staticProps) {
  const params = staticProps.params;
  const coffeeStores = await fetchCoffeeStores();
  const coffeeStoreFromContext = coffeeStores.find((coffeeStore) => {
    return coffeeStore.id.toString() === params.id;
  });
  return {
    props: {
      coffeeStore: coffeeStoreFromContext ? coffeeStoreFromContext : {},
    },
  };
}

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores();
  const paths = coffeeStores.map((coffeeStore) => {
    return {
      params: {
        id: coffeeStore.id.toString(),
      },
    };
  });
  return {
    paths,
    fallback: true,
  };
}

const CoffeeStore = (initialProps) => {
  const router = useRouter();
  const id = router.query.id;
  const [coffeeStore, setCoffeeStore] = useState(
    initialProps.coffeeStore || {}
  );

  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  const handleCreateCoffeeStore = async (coffeeStore) => {
    try {
      const { id, name, voting, imgUrl, neighborhood, address } = coffeeStore;
      const res = await fetch("/api/createCoffeeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          voting: 0,
          imgUrl,
          neighborhood: neighborhood || "",
          address: address || "",
        }),
      });
      const dbCoffeeStore = await res.json();
    } catch (err) {
      console.error("Error creating coffeeStore", err);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (isEmpty(initialProps.coffeeStore)) {
        if (!isEmpty(coffeeStores)) {
          const coffeeStoreFromContext = coffeeStores.find((coffeeStore) => {
            return coffeeStore.id.toString() === id;
          });
          if (coffeeStoreFromContext) {
            setCoffeeStore(coffeeStoreFromContext);
            handleCreateCoffeeStore(coffeeStoreFromContext);
          }
        }
      } else {
        // SSG
        handleCreateCoffeeStore(initialProps.coffeeStore);
      }
    }, 100);
    return () => clearTimeout(debounce);
  }, [id, initialProps, initialProps.coffeeStore]);

  const { name, address, neighborhood, imgUrl } = coffeeStore;

  const [voting, setVoting] = useState(0);
  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (data && data.length > 0) {
        setCoffeeStore(data[0]);
        setVoting(data[0].voting);
      }
    }, 10);
    return () => clearTimeout(debounce);
  }, [data]);

  const handleUpvoteButton = async () => {
    try {
      const res = await fetch("/api/favouriteCoffeeStoreById", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });
      const dbCoffeeStore = await res.json();
      if (dbCoffeeStore && dbCoffeeStore.length > 0) {
        let count = voting + 1;
        setVoting(count);
      }
    } catch (err) {
      console.error("Error upvoting the coffee store", err);
    }
  };

  if (error) {
    return <div>Somthing went wrong retrieveing coffee store page</div>;
  }

  if (router.isFallback) {
    return <Spinner />;
  }
  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
        <meta name="description" content={`${name} coffee store`} />
      </Head>

      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a>👈 Back to home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <div className={styles.storeImgWrapper}>
            <Image
              className={styles.storeImg}
              src={
                imgUrl ||
                "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
              }
              width={600}
              height={360}
              alt={name}
            />
          </div>
        </div>
        <div className={cls("glass", styles.col2)}>
          {address && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/address.svg"
                width="24"
                height="24"
                alt="icon"
                style={{ color: "var(#a7c957)" }}
              />
              <p className={styles.text}>{address}</p>
            </div>
          )}
          {neighborhood && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/places.svg"
                width="24"
                height="24"
                alt="icon"
              />
              <p className={styles.text}>{neighborhood}</p>
            </div>
          )}

          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/star.svg"
              width="24"
              height="24"
              alt="icon"
            />
            <p className={styles.text}>{voting}</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
