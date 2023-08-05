import { useState, useEffect, useRef } from "react";
import Messages from "./Components/Messages";
import { app } from "./firebase";
import {
  Box,
  Button,
  Container,
  HStack,
  Input,
  VStack,
} from "@chakra-ui/react";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

function App() {
  const auth = getAuth(app);
  const db = getFirestore(app);

  const [user, setuser] = useState(false);
  const [message, setmessage] = useState("");
  const [messages, setmessages] = useState([]);

  const divforScroll = useRef(null)


  const loginHandler = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const logoutHandler = () => {
    signOut(auth);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      setmessage("");
      await addDoc(collection(db, "Messages"), {
        text: message,
        uid: user.uid,
        uri: user.photoURL,
        createdAt: serverTimestamp(),
      });
      divforScroll.current.scrollIntoView({behavior : "smooth"})
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
  const q = query(collection(db, "Messages"), orderBy("createdAt", "asc"));

    const unSubscribe = onAuthStateChanged(auth, (data) => {
      setuser(data);
    });
    const unsubscribeforMessages = onSnapshot(q, (snap) => {
      setmessages(
        snap.docs.map((item) => {
          const id = item.id;
          return { id, ...item.data() };
        })
      );
    });
    return () => {
      unSubscribe();
      unsubscribeforMessages();
    };
    // eslint-disable-next-line
  },[]);

  return (
    <Box bg="gray.200">
      {user ? (
        <Container h="100vh" bg="white">
          <VStack h="full" paddingY="2" >
            <Button onClick={logoutHandler} w="full" colorScheme="red">
              Logout
            </Button>
            <VStack h="full" w="full" paddingY="1" overflowY="auto" css={{"&::-webkit-scrollbar" :{display: "none"}}}>
              {messages.map((item) => (
                <Messages
                  key={item.id}
                  text={item.text}
                  uri={item.uri}
                  user={item.uid === user.uid ? "me" : "other"}
                />
              ))}
              <div ref={divforScroll}></div>
            </VStack>
            <form onSubmit={submitHandler} style={{ width: "100%" }}>
              <HStack>
                <Input
                  value={message}
                  onChange={(e) => {
                    setmessage(e.target.value);
                  }}
                  border="1px"
                  placeholder="Enter your text..."
                ></Input>
                <Button type="submit" colorScheme="purple">
                  send
                </Button>
              </HStack>
            </form>
          </VStack>
        </Container>
      ) : (
        <VStack justifyContent="center" h="100vh">
          <Button
            onClick={loginHandler}
            border="1px solid gray"
            colorScheme="purple"
          >
            Sign in with Google to continue
          </Button>
        </VStack>
      )}
    </Box>
  );
}

export default App;
