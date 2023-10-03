--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3 (Debian 15.3-0+deb12u1)
-- Dumped by pg_dump version 15.3 (Debian 15.3-0+deb12u1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Admin; Type: TABLE; Schema: public; Owner: kramjatt
--

CREATE TABLE public."Admin" (
    "adminId" integer NOT NULL
);


ALTER TABLE public."Admin" OWNER TO kramjatt;

--
-- Name: Admin_adminId_seq; Type: SEQUENCE; Schema: public; Owner: kramjatt
--

CREATE SEQUENCE public."Admin_adminId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Admin_adminId_seq" OWNER TO kramjatt;

--
-- Name: Admin_adminId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kramjatt
--

ALTER SEQUENCE public."Admin_adminId_seq" OWNED BY public."Admin"."adminId";


--
-- Name: Channel; Type: TABLE; Schema: public; Owner: kramjatt
--

CREATE TABLE public."Channel" (
    "channelId" integer NOT NULL
);


ALTER TABLE public."Channel" OWNER TO kramjatt;

--
-- Name: ChannelAdmin; Type: TABLE; Schema: public; Owner: kramjatt
--

CREATE TABLE public."ChannelAdmin" (
    "adminId" integer NOT NULL,
    "channelId" integer NOT NULL
);


ALTER TABLE public."ChannelAdmin" OWNER TO kramjatt;

--
-- Name: ChannelMessages; Type: TABLE; Schema: public; Owner: kramjatt
--

CREATE TABLE public."ChannelMessages" (
    "messageId" integer NOT NULL,
    "channelId" integer,
    message_text text,
    message_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public."ChannelMessages" OWNER TO kramjatt;

--
-- Name: ChannelMessages_messageId_seq; Type: SEQUENCE; Schema: public; Owner: kramjatt
--

CREATE SEQUENCE public."ChannelMessages_messageId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ChannelMessages_messageId_seq" OWNER TO kramjatt;

--
-- Name: ChannelMessages_messageId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kramjatt
--

ALTER SEQUENCE public."ChannelMessages_messageId_seq" OWNED BY public."ChannelMessages"."messageId";


--
-- Name: Channel_channelId_seq; Type: SEQUENCE; Schema: public; Owner: kramjatt
--

CREATE SEQUENCE public."Channel_channelId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Channel_channelId_seq" OWNER TO kramjatt;

--
-- Name: Channel_channelId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kramjatt
--

ALTER SEQUENCE public."Channel_channelId_seq" OWNED BY public."Channel"."channelId";


--
-- Name: Game; Type: TABLE; Schema: public; Owner: kramjatt
--

CREATE TABLE public."Game" (
    "gameId" integer NOT NULL
);


ALTER TABLE public."Game" OWNER TO kramjatt;

--
-- Name: Game_gameId_seq; Type: SEQUENCE; Schema: public; Owner: kramjatt
--

CREATE SEQUENCE public."Game_gameId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Game_gameId_seq" OWNER TO kramjatt;

--
-- Name: Game_gameId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kramjatt
--

ALTER SEQUENCE public."Game_gameId_seq" OWNED BY public."Game"."gameId";


--
-- Name: User; Type: TABLE; Schema: public; Owner: kramjatt
--

CREATE TABLE public."User" (
    "userId" integer NOT NULL,
    "userName" text,
    "userPass" text
);


ALTER TABLE public."User" OWNER TO kramjatt;

--
-- Name: User_userId_seq; Type: SEQUENCE; Schema: public; Owner: kramjatt
--

CREATE SEQUENCE public."User_userId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."User_userId_seq" OWNER TO kramjatt;

--
-- Name: User_userId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kramjatt
--

ALTER SEQUENCE public."User_userId_seq" OWNED BY public."User"."userId";


--
-- Name: Admin adminId; Type: DEFAULT; Schema: public; Owner: kramjatt
--

ALTER TABLE ONLY public."Admin" ALTER COLUMN "adminId" SET DEFAULT nextval('public."Admin_adminId_seq"'::regclass);


--
-- Name: Channel channelId; Type: DEFAULT; Schema: public; Owner: kramjatt
--

ALTER TABLE ONLY public."Channel" ALTER COLUMN "channelId" SET DEFAULT nextval('public."Channel_channelId_seq"'::regclass);


--
-- Name: ChannelMessages messageId; Type: DEFAULT; Schema: public; Owner: kramjatt
--

ALTER TABLE ONLY public."ChannelMessages" ALTER COLUMN "messageId" SET DEFAULT nextval('public."ChannelMessages_messageId_seq"'::regclass);


--
-- Name: Game gameId; Type: DEFAULT; Schema: public; Owner: kramjatt
--

ALTER TABLE ONLY public."Game" ALTER COLUMN "gameId" SET DEFAULT nextval('public."Game_gameId_seq"'::regclass);


--
-- Name: User userId; Type: DEFAULT; Schema: public; Owner: kramjatt
--

ALTER TABLE ONLY public."User" ALTER COLUMN "userId" SET DEFAULT nextval('public."User_userId_seq"'::regclass);


--
-- Data for Name: Admin; Type: TABLE DATA; Schema: public; Owner: kramjatt
--

COPY public."Admin" ("adminId") FROM stdin;
\.


--
-- Data for Name: Channel; Type: TABLE DATA; Schema: public; Owner: kramjatt
--

COPY public."Channel" ("channelId") FROM stdin;
\.


--
-- Data for Name: ChannelAdmin; Type: TABLE DATA; Schema: public; Owner: kramjatt
--

COPY public."ChannelAdmin" ("adminId", "channelId") FROM stdin;
\.


--
-- Data for Name: ChannelMessages; Type: TABLE DATA; Schema: public; Owner: kramjatt
--

COPY public."ChannelMessages" ("messageId", "channelId", message_text, message_date) FROM stdin;
\.


--
-- Data for Name: Game; Type: TABLE DATA; Schema: public; Owner: kramjatt
--

COPY public."Game" ("gameId") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: kramjatt
--

COPY public."User" ("userId", "userName", "userPass") FROM stdin;
1	\N	\N
2	\N	\N
3	\N	\N
4	\N	\N
5	\N	\N
6	\N	\N
7	\N	\N
8	\N	\N
9	\N	\N
10	\N	\N
11	\N	\N
12	\N	\N
13	\N	\N
14	\N	\N
15	\N	\N
16	\N	\N
17	\N	\N
18	\N	\N
19	\N	\N
20	\N	\N
21	\N	\N
22	\N	\N
23	\N	\N
24	\N	\N
25	\N	\N
26	\N	\N
27	\N	\N
28	\N	\N
29	\N	\N
30	\N	\N
31	\N	\N
32	\N	\N
33	\N	\N
34	\N	\N
35	\N	\N
36	\N	\N
37	\N	\N
38	\N	\N
39	\N	\N
40	\N	\N
41	\N	\N
42	\N	\N
43	\N	\N
44	\N	\N
45	\N	\N
46	\N	\N
47	\N	\N
48	\N	\N
49	\N	\N
50	\N	\N
51	DamsLaMenace	\N
52	DamsLaMenace	\N
53	DamsLaMenace	\N
54	DamsLaMenace	\N
55	DamsLaMenace	\N
56	DamsLaMenace	\N
57	DamsLaMenace	\N
58	DamsLaMenace	\N
59	DamsLaMenace	\N
60	DamsLaMenace	\N
61	DamsLaMenace	\N
62	DamsLaMenace	\N
63	DamsLaMenace	\N
64	DamsLaMenace	\N
65	DamsLaMenace	\N
66	DamsLaMenace	\N
67	DamsLaMenace	\N
68	DamsLaMenace	\N
69	DamsLaMenace	\N
70	DamsLaMenace	\N
71	DamsLaMenace	\N
72	DamsLaMenace	\N
73	\N	\N
74	\N	\N
75	\N	\N
76	\N	\N
77	\N	\N
78	\N	\N
79	\N	\N
80	\N	\N
81	\N	\N
82	\N	\N
83	\N	\N
84	\N	\N
85	DamsLaMenace	\N
86	DamsLaMenace	\N
\.


--
-- Name: Admin_adminId_seq; Type: SEQUENCE SET; Schema: public; Owner: kramjatt
--

SELECT pg_catalog.setval('public."Admin_adminId_seq"', 1, false);


--
-- Name: ChannelMessages_messageId_seq; Type: SEQUENCE SET; Schema: public; Owner: kramjatt
--

SELECT pg_catalog.setval('public."ChannelMessages_messageId_seq"', 1, false);


--
-- Name: Channel_channelId_seq; Type: SEQUENCE SET; Schema: public; Owner: kramjatt
--

SELECT pg_catalog.setval('public."Channel_channelId_seq"', 1, false);


--
-- Name: Game_gameId_seq; Type: SEQUENCE SET; Schema: public; Owner: kramjatt
--

SELECT pg_catalog.setval('public."Game_gameId_seq"', 1, false);


--
-- Name: User_userId_seq; Type: SEQUENCE SET; Schema: public; Owner: kramjatt
--

SELECT pg_catalog.setval('public."User_userId_seq"', 117, true);


--
-- Name: Admin Admin_pkey; Type: CONSTRAINT; Schema: public; Owner: kramjatt
--

ALTER TABLE ONLY public."Admin"
    ADD CONSTRAINT "Admin_pkey" PRIMARY KEY ("adminId");


--
-- Name: ChannelAdmin ChannelAdmin_pkey; Type: CONSTRAINT; Schema: public; Owner: kramjatt
--

ALTER TABLE ONLY public."ChannelAdmin"
    ADD CONSTRAINT "ChannelAdmin_pkey" PRIMARY KEY ("adminId", "channelId");


--
-- Name: ChannelMessages ChannelMessages_pkey; Type: CONSTRAINT; Schema: public; Owner: kramjatt
--

ALTER TABLE ONLY public."ChannelMessages"
    ADD CONSTRAINT "ChannelMessages_pkey" PRIMARY KEY ("messageId");


--
-- Name: Channel Channel_pkey; Type: CONSTRAINT; Schema: public; Owner: kramjatt
--

ALTER TABLE ONLY public."Channel"
    ADD CONSTRAINT "Channel_pkey" PRIMARY KEY ("channelId");


--
-- Name: Game Game_pkey; Type: CONSTRAINT; Schema: public; Owner: kramjatt
--

ALTER TABLE ONLY public."Game"
    ADD CONSTRAINT "Game_pkey" PRIMARY KEY ("gameId");


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: kramjatt
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userId");


--
-- Name: ChannelAdmin ChannelAdmin_adminId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kramjatt
--

ALTER TABLE ONLY public."ChannelAdmin"
    ADD CONSTRAINT "ChannelAdmin_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES public."Admin"("adminId");


--
-- Name: ChannelAdmin ChannelAdmin_channelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kramjatt
--

ALTER TABLE ONLY public."ChannelAdmin"
    ADD CONSTRAINT "ChannelAdmin_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES public."Channel"("channelId");


--
-- Name: ChannelMessages ChannelMessages_channelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kramjatt
--

ALTER TABLE ONLY public."ChannelMessages"
    ADD CONSTRAINT "ChannelMessages_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES public."Channel"("channelId");


--
-- PostgreSQL database dump complete
--

