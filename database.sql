--
-- PostgreSQL database dump
--

-- Dumped from database version 10.23
-- Dumped by pg_dump version 16.0

-- Started on 2024-09-10 18:14:04

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

--
-- TOC entry 6 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 231 (class 1255 OID 16620)
-- Name: update_critical_chance(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_critical_chance() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
	intelligence_value FLOAT;
BEGIN
	intelligence_value := COALESCE((NEW.skills->>'intelligence')::FLOAT, 0);
	NEW.critical_chance := 0.10 + (intelligence_value * 0.03) + (NEW.level * 0.02);
	RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_critical_chance() OWNER TO postgres;

--
-- TOC entry 228 (class 1255 OID 16616)
-- Name: update_critical_damage_primary(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_critical_damage_primary() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	NEW.critical_damage_primary := NEW.base_damage_primary * 1.20;
	RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_critical_damage_primary() OWNER TO postgres;

--
-- TOC entry 229 (class 1255 OID 16618)
-- Name: update_critical_damage_secondary(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_critical_damage_secondary() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	NEW.critical_damage_secondary := NEW.base_damage_secondary * 1.20;
	RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_critical_damage_secondary() OWNER TO postgres;

--
-- TOC entry 230 (class 1255 OID 16622)
-- Name: update_dodge_chance(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_dodge_chance() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
	agility_value FLOAT;
BEGIN
	agility_value := COALESCE((NEW.skills->>'agility')::FLOAT, 0);
	NEW.dodge_chance := 0.08 + (agility_value * 0.04) + (NEW.level * 0.02);
	RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_dodge_chance() OWNER TO postgres;

--
-- TOC entry 223 (class 1255 OID 16603)
-- Name: update_experience_to_next_level(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_experience_to_next_level() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	NEW.experience_to_next_level := NEW.level * 100;
	RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_experience_to_next_level() OWNER TO postgres;

--
-- TOC entry 225 (class 1255 OID 16609)
-- Name: update_health_based_on_level_and_constitution(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_health_based_on_level_and_constitution() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	DECLARE
	constitution_value FLOAT;
	BEGIN
		constitution_value := COALESCE((NEW.skills->>'constitution')::FLOAT, 0);
		NEW.health := 100 * (1 + NEW.level) * (1 + (constitution_value * 0.05));
		RETURN NEW;
	END;
END;
$$;


ALTER FUNCTION public.update_health_based_on_level_and_constitution() OWNER TO postgres;

--
-- TOC entry 224 (class 1255 OID 16606)
-- Name: update_level_based_on_experience(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_level_based_on_experience() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	IF NEW.experience >= NEW.experience_to_next_level THEN
	NEW.level := NEW.level + 1;
	NEW.experiencce_to_next_level := NEW.level * 100;
	NEW.experience := NEW.experience - (NEW.level * 100 - 100);
	END IF;
	RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_level_based_on_experience() OWNER TO postgres;

--
-- TOC entry 226 (class 1255 OID 16611)
-- Name: update_primary_based_on_level_and_shooting(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_primary_based_on_level_and_shooting() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	DECLARE
	shooting_value FLOAT;
	BEGIN
		shooting_value := COALESCE((NEW.skills->>'shooting')::FLOAT, 0);
		NEW.base_damage_primary := 100 * (1 + NEW.level) * (1 + (shooting_value * 0.05));
		RETURN NEW;
	END;
END;
$$;


ALTER FUNCTION public.update_primary_based_on_level_and_shooting() OWNER TO postgres;

--
-- TOC entry 227 (class 1255 OID 16613)
-- Name: update_secondary_based_on_level_and_strength(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_secondary_based_on_level_and_strength() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	DECLARE
	strength_value FLOAT;
	BEGIN
		strength_value := COALESCE((NEW.skills->>'strength')::FLOAT, 0);
		NEW.base_damage_secondary := 100 * (1 + NEW.level) * (1 + (strength_value * 0.05));
		RETURN NEW;
	END;
END;
$$;


ALTER FUNCTION public.update_secondary_based_on_level_and_strength() OWNER TO postgres;

--
-- TOC entry 232 (class 1255 OID 16632)
-- Name: update_zombie_critical_damage_max(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_zombie_critical_damage_max() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Calculate critical damage as 10% higher than base max damage
    NEW.critical_damage_max := NEW.damage_max * 1.10;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_zombie_critical_damage_max() OWNER TO postgres;

--
-- TOC entry 233 (class 1255 OID 16634)
-- Name: update_zombie_critical_damage_min(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_zombie_critical_damage_min() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	 -- Calculate critical damage as 10% higher than base minimum damage
    NEW.critical_damage_min := NEW.damage_min * 1.10;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_zombie_critical_damage_min() OWNER TO postgres;

--
-- TOC entry 246 (class 1255 OID 16793)
-- Name: validate_equipment(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.validate_equipment() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
	equipment JSONB;
	weapon_id INT;
	armor_id INT;
	helmet_id INT;
	torso_armor_id INT;
	boots_id INT;
BEGIN
	equipment := NEW.equipment;
	weapon_id := (equipment->>'primary_weapon')::INT;
	IF weapon_id IS NOT NULL THEN
		IF NOT EXISTS(
			SELECT 1
			FROM inventory
			WHERE character_id = NEW.id
				AND (weapon_id = weapon_id OR weapon_id = (equipment->>'secondary_weapon')::INT)
		)THEN
			RAISE EXCEPTION 'Weapon does not exist for this character inventory!';
		END IF;
	END IF;
    helmet_id := (equipment->>'helmet')::INT;
    torso_armor_id := (equipment->>'armor')::INT;
    boots_id := (equipment->>'boots')::INT;
	IF helmet_id IS NOT NULL OR torso_armor_id IS NOT NULL OR boots_id IS NOT NULL THEN
		IF NOT EXISTS(
			SELECT 1
			FROM inventory
			WHERE character_id = NEW.id
				AND(helmet_id = armor_id OR torso_armor_id = armor_id OR boots_id = armor_id)
		)THEN
			RAISE EXCEPTION 'Armor does not exist for this character inventory!';
		END IF;
	END IF;
	RETURN NEW;
END;
$$;


ALTER FUNCTION public.validate_equipment() OWNER TO postgres;

SET default_tablespace = '';

--
-- TOC entry 211 (class 1259 OID 16666)
-- Name: armor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.armor (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    description character varying(550) NOT NULL,
    armor_modifier integer NOT NULL,
    image character varying(256) NOT NULL,
    type character varying(20) NOT NULL,
    attachments jsonb[],
    armor_category character varying(256)
);


ALTER TABLE public.armor OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16739)
-- Name: armor_and_attachments_junction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.armor_and_attachments_junction (
    armor_id integer NOT NULL,
    attachment_id integer NOT NULL
);


ALTER TABLE public.armor_and_attachments_junction OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 16664)
-- Name: armor_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.armor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.armor_id_seq OWNER TO postgres;

--
-- TOC entry 3021 (class 0 OID 0)
-- Dependencies: 210
-- Name: armor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.armor_id_seq OWNED BY public.armor.id;


--
-- TOC entry 217 (class 1259 OID 16699)
-- Name: attachments_armor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attachments_armor (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    description character varying(256) NOT NULL,
    critical_damage integer DEFAULT 0,
    critical_chance double precision DEFAULT 0,
    damage integer DEFAULT 0,
    armor integer DEFAULT 0,
    image character varying(256) NOT NULL,
    type character varying(20) NOT NULL,
    for_armor_type character varying[]
);


ALTER TABLE public.attachments_armor OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16697)
-- Name: attachments_armor_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attachments_armor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attachments_armor_id_seq OWNER TO postgres;

--
-- TOC entry 3022 (class 0 OID 0)
-- Dependencies: 216
-- Name: attachments_armor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attachments_armor_id_seq OWNED BY public.attachments_armor.id;


--
-- TOC entry 213 (class 1259 OID 16677)
-- Name: attachments_primary_weapon; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attachments_primary_weapon (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    description character varying(256) NOT NULL,
    critical_damage integer DEFAULT 0,
    critical_chance double precision DEFAULT 0,
    damage integer DEFAULT 0,
    image character varying(256) NOT NULL,
    type character varying(20) NOT NULL,
    for_weapon_type character varying[] NOT NULL
);


ALTER TABLE public.attachments_primary_weapon OWNER TO postgres;

--
-- TOC entry 212 (class 1259 OID 16675)
-- Name: attachments_primary_weapon_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attachments_primary_weapon_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attachments_primary_weapon_id_seq OWNER TO postgres;

--
-- TOC entry 3023 (class 0 OID 0)
-- Dependencies: 212
-- Name: attachments_primary_weapon_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attachments_primary_weapon_id_seq OWNED BY public.attachments_primary_weapon.id;


--
-- TOC entry 215 (class 1259 OID 16688)
-- Name: attachments_secondary_weapon; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attachments_secondary_weapon (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    description character varying(256) NOT NULL,
    critical_damage integer DEFAULT 0,
    critical_chance double precision DEFAULT 0,
    damage integer DEFAULT 0,
    image character varying(256) NOT NULL,
    type character varying(20) NOT NULL,
    for_weapon_type character varying[] NOT NULL
);


ALTER TABLE public.attachments_secondary_weapon OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 16686)
-- Name: attachments_secondary_weapon_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attachments_secondary_weapon_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attachments_secondary_weapon_id_seq OWNER TO postgres;

--
-- TOC entry 3024 (class 0 OID 0)
-- Dependencies: 214
-- Name: attachments_secondary_weapon_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attachments_secondary_weapon_id_seq OWNED BY public.attachments_secondary_weapon.id;


--
-- TOC entry 198 (class 1259 OID 16423)
-- Name: avatars; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.avatars (
    link character varying,
    gender "char",
    id integer NOT NULL
);


ALTER TABLE public.avatars OWNER TO postgres;

--
-- TOC entry 200 (class 1259 OID 16433)
-- Name: characters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.characters (
    id integer NOT NULL,
    user_id integer NOT NULL,
    avatar_id integer NOT NULL,
    level integer DEFAULT 1 NOT NULL,
    gender character varying(255) NOT NULL,
    class character varying(255) NOT NULL,
    skills json,
    bio character varying(255) NOT NULL,
    experience integer DEFAULT 0,
    base_damage_primary integer DEFAULT 5,
    base_damage_secondary integer DEFAULT 2,
    health integer DEFAULT 100,
    armor integer DEFAULT 10,
    experience_to_next_level integer,
    critical_damage_primary integer,
    critical_damage_secondary integer,
    critical_chance double precision,
    dodge_chance double precision,
    equipment jsonb DEFAULT '{"armor": null, "boots": null, "helmet": null, "primary_weapon": null, "secondary_weapon": null}'::jsonb
);


ALTER TABLE public.characters OWNER TO postgres;

--
-- TOC entry 199 (class 1259 OID 16431)
-- Name: characters_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.characters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.characters_id_seq OWNER TO postgres;

--
-- TOC entry 3025 (class 0 OID 0)
-- Dependencies: 199
-- Name: characters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.characters_id_seq OWNED BY public.characters.id;


--
-- TOC entry 203 (class 1259 OID 16548)
-- Name: intro_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.intro_images (
    id integer NOT NULL,
    link character varying(255) NOT NULL
);


ALTER TABLE public.intro_images OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 16546)
-- Name: intro_images_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.intro_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.intro_images_id_seq OWNER TO postgres;

--
-- TOC entry 3026 (class 0 OID 0)
-- Dependencies: 202
-- Name: intro_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.intro_images_id_seq OWNED BY public.intro_images.id;


--
-- TOC entry 222 (class 1259 OID 16756)
-- Name: inventory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory (
    id integer NOT NULL,
    character_id integer NOT NULL,
    primary_weapon_id integer,
    secondary_weapon_id integer,
    armor_id integer,
    quantity integer DEFAULT 0
);


ALTER TABLE public.inventory OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16754)
-- Name: inventory_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inventory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inventory_id_seq OWNER TO postgres;

--
-- TOC entry 3027 (class 0 OID 0)
-- Dependencies: 221
-- Name: inventory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inventory_id_seq OWNED BY public.inventory.id;


--
-- TOC entry 218 (class 1259 OID 16709)
-- Name: primary_weapon_and_attachments_junction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.primary_weapon_and_attachments_junction (
    weapon_id integer NOT NULL,
    attachment_id integer NOT NULL
);


ALTER TABLE public.primary_weapon_and_attachments_junction OWNER TO postgres;

--
-- TOC entry 207 (class 1259 OID 16638)
-- Name: primary_weapons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.primary_weapons (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    description character varying(500) NOT NULL,
    damage_min integer NOT NULL,
    damage_max integer NOT NULL,
    critical_damage_max integer DEFAULT 3,
    critical_damage_min integer DEFAULT 1,
    critical_chance double precision DEFAULT 0,
    image character varying(256) NOT NULL,
    type character varying(50) NOT NULL,
    attachments jsonb[],
    weapon_category character varying(256)
);


ALTER TABLE public.primary_weapons OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 16636)
-- Name: primary_weapons_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.primary_weapons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.primary_weapons_id_seq OWNER TO postgres;

--
-- TOC entry 3028 (class 0 OID 0)
-- Dependencies: 206
-- Name: primary_weapons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.primary_weapons_id_seq OWNED BY public.primary_weapons.id;


--
-- TOC entry 219 (class 1259 OID 16724)
-- Name: secondary_weapon_and_attachments_junction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.secondary_weapon_and_attachments_junction (
    weapon_id integer NOT NULL,
    attachment_id integer NOT NULL
);


ALTER TABLE public.secondary_weapon_and_attachments_junction OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 16652)
-- Name: secondary_weapons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.secondary_weapons (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    description character varying(500) NOT NULL,
    damage_min integer NOT NULL,
    damage_max integer NOT NULL,
    critical_damage_max integer DEFAULT 3,
    critical_damage_min integer DEFAULT 1,
    critical_chance double precision DEFAULT 0,
    image character varying(256) NOT NULL,
    type character varying(20) NOT NULL,
    attachments jsonb[],
    weapon_category character varying(256)
);


ALTER TABLE public.secondary_weapons OWNER TO postgres;

--
-- TOC entry 208 (class 1259 OID 16650)
-- Name: secondary_weapons_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.secondary_weapons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.secondary_weapons_id_seq OWNER TO postgres;

--
-- TOC entry 3029 (class 0 OID 0)
-- Dependencies: 208
-- Name: secondary_weapons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.secondary_weapons_id_seq OWNED BY public.secondary_weapons.id;


--
-- TOC entry 201 (class 1259 OID 16521)
-- Name: session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO postgres;

--
-- TOC entry 197 (class 1259 OID 16396)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    session_secret character varying NOT NULL,
    has_created_character boolean DEFAULT false,
    profile_picture text DEFAULT 'https://drive.google.com/thumbnail?id=1C3m0pTQTH0dyhzGlpUVnqN0vqCfvECj2'::text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 196 (class 1259 OID 16394)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 3030 (class 0 OID 0)
-- Dependencies: 196
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 205 (class 1259 OID 16626)
-- Name: zombies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.zombies (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    description character varying(100) NOT NULL,
    damage_min integer NOT NULL,
    critical_damage_min integer,
    damage_max integer NOT NULL,
    critical_damage_max integer,
    critical_chance double precision,
    health_min integer NOT NULL,
    health_max integer NOT NULL,
    type character varying(20) NOT NULL
);


ALTER TABLE public.zombies OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 16624)
-- Name: zombies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.zombies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.zombies_id_seq OWNER TO postgres;

--
-- TOC entry 3031 (class 0 OID 0)
-- Dependencies: 204
-- Name: zombies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.zombies_id_seq OWNED BY public.zombies.id;


--
-- TOC entry 2794 (class 2604 OID 16669)
-- Name: armor id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.armor ALTER COLUMN id SET DEFAULT nextval('public.armor_id_seq'::regclass);


--
-- TOC entry 2803 (class 2604 OID 16702)
-- Name: attachments_armor id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attachments_armor ALTER COLUMN id SET DEFAULT nextval('public.attachments_armor_id_seq'::regclass);


--
-- TOC entry 2795 (class 2604 OID 16680)
-- Name: attachments_primary_weapon id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attachments_primary_weapon ALTER COLUMN id SET DEFAULT nextval('public.attachments_primary_weapon_id_seq'::regclass);


--
-- TOC entry 2799 (class 2604 OID 16691)
-- Name: attachments_secondary_weapon id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attachments_secondary_weapon ALTER COLUMN id SET DEFAULT nextval('public.attachments_secondary_weapon_id_seq'::regclass);


--
-- TOC entry 2776 (class 2604 OID 16436)
-- Name: characters id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.characters ALTER COLUMN id SET DEFAULT nextval('public.characters_id_seq'::regclass);


--
-- TOC entry 2784 (class 2604 OID 16551)
-- Name: intro_images id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.intro_images ALTER COLUMN id SET DEFAULT nextval('public.intro_images_id_seq'::regclass);


--
-- TOC entry 2808 (class 2604 OID 16759)
-- Name: inventory id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory ALTER COLUMN id SET DEFAULT nextval('public.inventory_id_seq'::regclass);


--
-- TOC entry 2786 (class 2604 OID 16641)
-- Name: primary_weapons id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.primary_weapons ALTER COLUMN id SET DEFAULT nextval('public.primary_weapons_id_seq'::regclass);


--
-- TOC entry 2790 (class 2604 OID 16655)
-- Name: secondary_weapons id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.secondary_weapons ALTER COLUMN id SET DEFAULT nextval('public.secondary_weapons_id_seq'::regclass);


--
-- TOC entry 2772 (class 2604 OID 16399)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 2785 (class 2604 OID 16629)
-- Name: zombies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zombies ALTER COLUMN id SET DEFAULT nextval('public.zombies_id_seq'::regclass);


--
-- TOC entry 3003 (class 0 OID 16666)
-- Dependencies: 211
-- Data for Name: armor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.armor (id, name, description, armor_modifier, image, type, attachments, armor_category) FROM stdin;
1	Casual Clothes	Fashion meets functionality in the most "whatever I could find" kind of way. Sure, it’s not bulletproof or designed to withstand a bite, but hey, it’s comfy, and sometimes that’s all that matters when you’re running for your life through a crumbling city.	15	https://i.imgur.com/u2JvtDs.png	armor	\N	Torso
2	Leather Jacket	Originally designed for bikers and rebels without a cause, it offers protection, style, and the unmistakable vibe of “I may not have a plan, but sure as heck I look like I do.”	23	https://i.imgur.com/bx5skOY.png	armor	\N	Torso
3	Bulletproof Vest	It’s heavy, bulky, and makes you look like you’re about to storm a bank instead of a infested grocery store, but hey, fashion went out the window with the first wave of the undead, right? What it lacks in comfort and style, it more than makes up for in the ability to take a hit.	44	https://i.imgur.com/2cGuVwy.png	armor	\N	Torso
4	Combat Armor	If your mindset in the apocalypse is, “I’m not here to survive; I’m here to thrive.” meet the ultimate, no-nonsense, head-to-toe armor. Originally designed for soldiers, this heavy-duty gear has found a second life in the wasteland, protecting you from bullets, claws, bites, and questionable fashion choices.	70	https://i.imgur.com/VPgdfTB.png	armor	\N	Torso
5	Sneakers	Let’s be honest: when the undead are hot on your tail, you want to be wearing something that lets you sprint like you're late for the last ice cream truck on Earth. Enter the humble sneakers, the ultimate footwear for surviving the end of the world in style, without giving up your ability to book it at a moment's notice.	9	https://i.imgur.com/ofr2M1d.png	armor	\N	Boots
6	Farmer Boots	For those who are here to thrive in the mud,  blood, and whatever questionable puddle they just stepped in. Originally designed for trudging through fields and muck, these boots have made the jump from barnyard to battleground without much trouble.	19	https://i.imgur.com/Qw86Lav.png	armor	\N	Boots
7	Hiking Boots	Designed for the rugged outdoors, built tough and designed to grip anything short of a vertical cliff (and maybe even that if you're feeling bold), hiking boots are the ultimate choice for the survivor who expects to walk everywhere. Heavy enough to let you stomp a head in, but comfy enough for long-distance trekking.	28	https://i.imgur.com/sTQ0iSL.png	armor	\N	Boots
8	Combat Boots	The footwear of choice for those who mean business. These heavy-duty, steel-toed wonders weren’t just built for walking, they were built for dominating the wasteland. Whether you’re trudging through rubble, mud, or the remains of that last undead you punted across the road, you can be sure your feet are well protected.	40	https://i.imgur.com/6FPceFJ.png	armor	\N	Boots
9	Baseball Cap	This isn’t just any cap—it’s your trusty, worn-in, post-apocalyptic crown. You’ve got your favorite baseball team proudly displayed on your forehead, letting everyone know that even though civilization has crumbled, your sense of casual cool hasn’t.	5	https://i.imgur.com/WKCfWQa.png	armor	\N	Helmet
10	Riding Helmet	This lightweight, foam-padded beauty offers a solid defense against... well, low-hanging branches and possibly a light head bump. Undead? Let’s just say, it’ll keep your brain safe from any sudden thoughts of horse-riding nostalgia.	17	https://i.imgur.com/Uqv55jG.png	armor	\N	Helmet
11	Motorcycle Helmet	Have you ever wanted to look like that you're always just one dramatic explosion away from hopping on a bike and riding off into the sunset. Sure, you might not have a working bike, but who cares? Just be prepared for the occasional awkward moment when you forget you’re wearing it and try to take a drink or eat something.	26	https://i.imgur.com/iZneVBV.png	armor	\N	Helmet
12	Military Helmet	Strapping on this baby instantly says, “I’ve watched all the apocalypse movies and I’m ready for anything.” With its tough, no-nonsense design, this helmet is sturdy, reliable, and gives off major “I know what I’m doing” vibes. A great find in the wasteland for sure.	37	https://i.imgur.com/rsPruD0.png	armor	\N	Helmet
\.


--
-- TOC entry 3012 (class 0 OID 16739)
-- Dependencies: 220
-- Data for Name: armor_and_attachments_junction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.armor_and_attachments_junction (armor_id, attachment_id) FROM stdin;
\.


--
-- TOC entry 3009 (class 0 OID 16699)
-- Dependencies: 217
-- Data for Name: attachments_armor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attachments_armor (id, name, description, critical_damage, critical_chance, damage, armor, image, type, for_armor_type) FROM stdin;
1	Spiked Wooden Plate	Ever dreamed of being a walking porcupine ? Well suit yourself, because now you can. Any undead daring to touch you will regret it big time. 	0	0	6	14	https://i.imgur.com/EDuWGy8.png	Armor Reinforcement	{'Torso'}
2	Reinforced Padding	Nothing better to stop the occasional bite than just putting on another layer of textile. 	0	0	0	22	https://i.imgur.com/RE85hfp.png	Armor Reinforcement	{'Torso'}
3	Neck Protector	Protects your sweet and vulnerable neck from the unusually quiet shambler sneaking up behind you once in a while. 	0	0	0	20	https://i.imgur.com/LVQvGR7.png	Helmet Reinforcement	{'Helmet'}
4	Helmet Spike Strip	What are you doing when you are out of ammo and your pipe just broke ? What a silly question, of course you use your helmet.	4	0.080000000000000002	5	2	https://i.imgur.com/wxLMFqc.png	Helmet Reinforcement	{'Helmet'}
5	Steel Infused Soles	You won't ever have to look for new shoes with this one. Comes with a bonus, the ability to crush undead skulls like they are watermelons.	6	0.089999999999999997	7	16	https://i.imgur.com/G0mnnqT.png	Boots Reinforcement	{'Boots'}
6	Boot Plates	Titanium boot plates that offer adequate protection and are lightweight. 	0	0	0	28	https://i.imgur.com/tZCpYTV.png	Boots Reinforcement	{'Boots'}
\.


--
-- TOC entry 3005 (class 0 OID 16677)
-- Dependencies: 213
-- Data for Name: attachments_primary_weapon; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attachments_primary_weapon (id, name, description, critical_damage, critical_chance, damage, image, type, for_weapon_type) FROM stdin;
14	Shotgun Supressor	Dampens the firearm noise and reduces fire spread. Mountable on shotguns.	2	0.17000000000000001	6	https://i.imgur.com/ZAqdZlS.png	Supressor	{"'Pump-Action Shotgun'","'Semi-Auto Shotgun'"}
15	Small Arms Supressor	Dampens the firearm noise and reduces fire spread, Mountable on pistols and SMG's.	5	0.19	2	https://i.imgur.com/mgjYZA4.png	Supressor	{'Pistol',"'Submachine Gun'"}
16	Small Flashlight	Provides illumination in dark spaces or during night operations.	1	0.14000000000000001	2	https://i.imgur.com/i1tKRcH.png	Flashlight	{'Pistol',"'Automatic Rifle'","'Semi-Automatic Rifle'","'Bolt-Action Rifle'","''Pump-Action Shotgun'","'Semi-Auto Shotgun'","'Submachine Gun'",'Revolver'}
1	2x Scope	Scope able to zoom up to 200 meters. Mountable on rifles, SMG's, pistols and revolvers.	4	0.040000000000000001	0	https://i.imgur.com/D5zp7bg.png	Scope	{"'Automatic Rifle'","'Semi-Automatic Rifle'","'Bolt-Action RIfle'",'Pistol','Revolver',"'Submachine Gun'"}
2	4x Scope	Scope, a bit heavy and able to zoom up to 400 meters. Mountable on rifles and SMG's	6	0.080000000000000002	0	https://i.imgur.com/ZgYlEby.png	Scope	{"'Automatic Rifle'","'Semi-Automatic Rifle'","'Bolt-Action Rifle'","'Submachine Gun'"}
11	Compensator	Reduces recoil during rapid fire	5	0.070000000000000007	6	https://i.imgur.com/UWQ8aMT.png	Compensator	{'Pistol'}
17	Heavy Duty Compensator	Reduces recoil from shooting with large caliber handguns.	7	0.059999999999999998	2	https://i.imgur.com/6Y2Tmm3.png	Compensator	{'Revolver'}
4	Choke Tube	Provides a narrower blast when the weapon is used thus decreasing the fire spread. Mountable only on shotguns.	7	0.10000000000000001	5	https://i.imgur.com/hxtlTCJ.png	Canon	{"'Pump-Action Shotgun'","'Semi-Automatic Shotgun'"}
3	8x Scope	Scope able to zoom up to 800 meters. Very heavy and mountable only on Bolt-Action rifles.	9	0.12	0	https://i.imgur.com/aZbxicw.png	Scope	{"'Bolt-Action Rifle'"}
5	Recoil Pad	Dampens the recoil when weapon is fired, thus significantly increasing accuracy. Mountable on automatic and semi-automatic rifles.	0	0.17000000000000001	0	https://i.imgur.com/FL4bHPl.png	Dampener	{"'Automatic Rifle'","'Semi-Automatic Rifle'"}
6	Laser Sight	A siderail attachment designed to provide the user with a guiding laser point. Lightweight and less clunky than a normal scope but also less effective. Mountable on rifles, pistols and SMG's.	3	0.070000000000000007	2	https://i.imgur.com/wbP4COi.png	Scope	{"'Automatic Rifle'","'Semi-Automatic Rifle'",'Pistol',"'Submachine Gun'"}
7	Ammo Straps	Useful for fast reloading and access to bullets instead of tumbling in your backpack.	0	0.089999999999999997	2	https://i.imgur.com/gFiJQmD.png	Sling	{"'Automatic Rifle'","'Semi-Automatic Rifle'","'Pump-Action Shotgun'","'Semi-Auto Shotgun'","'Bolt-Action Rifle'"}
8	Gun Sling	Reduces carry weight of the weapon it's attached to, and ensures faster response to threats with your trusty firearm being right under your arms.	0	0.040000000000000001	1	https://i.imgur.com/0YV3Del.png	Sling	{"'Automatic Rifle'","'Semi-Automatic Rifle'","'Pump-Action Shotgun'","'Semi-Auto Shotgun'","'Submachine Gun'","'Bolt-Action Rifle'"}
9	Fiberglass Stock	Ergonomic stock from modern materials that reduces firearm weight allowing for more stable aiming.	3	0.13	3	https://i.imgur.com/Zezqnfl.png	Stock	{"'Automatic Rifle'","'Semi-Automatic Rifle'","'Pump-Action Shotgun'","'Semi-Auto Shotgun'","'Bolt-Action RIfle'"}
10	Extended Clip	An extended magazine for pistols and SMG's, that holds bullets with double the amount of normal sized one.	2	0.050000000000000003	4	https://i.imgur.com/SURSovL.png	Magazine	{'Pistol',"'Submachine Gun'"}
12	Drum Magazine	Mountable on rifles and shotguns. Holds double the amount of normal magazines.	2	0.11	3	https://i.imgur.com/EvTZfDL.png	Magazine	{'Automatic-Rifle',"'Semi-Automatic Rifle'","'Pump-Action Shotgun'","'Semi-Auto Shotgun'"}
13	Rifle Supressor	Dampens the firearm noise and reduces fire spread. Mountable on rifles.	1	0.28000000000000003	3	https://i.imgur.com/PvQyeCh.png	Supressor	{"'Automatic Rifle'","'Semi-Automatic Rifle'","'Bolt-Action Rifle'"}
\.


--
-- TOC entry 3007 (class 0 OID 16688)
-- Dependencies: 215
-- Data for Name: attachments_secondary_weapon; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attachments_secondary_weapon (id, name, description, critical_damage, critical_chance, damage, image, type, for_weapon_type) FROM stdin;
2	Titanium Blade	Made from extremely durable and lightweight alloy. This blade penetrate a skull without much effort.	6	0.14000000000000001	7	https://i.imgur.com/8mFNYoj.png	Blade	{"'Short Blade'"}
3	Tungsten Weights	Increases blunt weapon's hit weight. Gravity is your friend with this one.	5	0.17000000000000001	5	https://i.imgur.com/zgpH8Jw.png	Weight	{"'Short Blunt'","'Long Blunt'"}
4	Battle Axe Head	No one knows how this came in the wasteland, but here it is. Enjoy a wider area of impact when swinging that axe of yours.	8	0.13	9	https://i.imgur.com/4Pu21it.png	Axe Head	{'Axe'}
1	Leather Grip	Provides better comfort and friction between user's hand and the weapon. 	3	0.089999999999999997	5	https://i.imgur.com/8s31yWi.png	Grip	{"'Short Blunt'","'Long Blunt'",'Spear'}
5	Chainsaw Teeth	Your Majesty isn't satisfied with simple machete or katana ? You want even more gore ? Here's your solution.	10	0.17999999999999999	11	https://i.imgur.com/xZhlyZo.png	Chain	{"'Long Blade'"}
\.


--
-- TOC entry 2990 (class 0 OID 16423)
-- Dependencies: 198
-- Data for Name: avatars; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.avatars (link, gender, id) FROM stdin;
https://drive.google.com/thumbnail?id=1hhspPzsZkq0SFsve6At74BGKuuQMGg3z	F	6
https://drive.google.com/thumbnail?id=1612ilyU5SoVAedugYm2hC4n-qEOh018-	M	1
https://drive.google.com/thumbnail?id=12swIhTeSr9drLwUOrkRB0eQUMLFdq0om	M	2
https://drive.google.com/thumbnail?id=1U9yad9ycomMM5zRgCmD7yn1DdQ6IHsUc	M	3
https://drive.google.com/thumbnail?id=1Gtm5uQ1Wwg4pIKSgLrFUObXVvUS2jnVi	F	4
https://drive.google.com/thumbnail?id=1cTlSc8v3nRFFIuOwKxhyPqin9WNRaWiR	F	5
\.


--
-- TOC entry 2992 (class 0 OID 16433)
-- Dependencies: 200
-- Data for Name: characters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.characters (id, user_id, avatar_id, level, gender, class, skills, bio, experience, base_damage_primary, base_damage_secondary, health, armor, experience_to_next_level, critical_damage_primary, critical_damage_secondary, critical_chance, dodge_chance, equipment) FROM stdin;
8	20	1	1	male	police-officer	{"strength":1,"shooting":3,"agility":1,"intelligence":6,"charisma":1,"constitution":1}	asd	0	5	2	100	10	100	\N	\N	\N	\N	{"armor": null, "boots": null, "helmet": null, "primary_weapon": null, "secondary_weapon": null}
9	22	1	1	male	police-officer	{"strength":1,"shooting":3,"agility":1,"intelligence":1,"charisma":6,"constitution":1}		0	5	2	100	10	100	\N	\N	\N	\N	{"armor": null, "boots": null, "helmet": null, "primary_weapon": null, "secondary_weapon": null}
10	23	1	1	male	police-officer	{"strength":6,"shooting":3,"agility":1,"intelligence":1,"charisma":1,"constitution":1}		0	5	2	100	10	100	\N	\N	\N	\N	{"armor": null, "boots": null, "helmet": null, "primary_weapon": null, "secondary_weapon": null}
11	24	3	1	male	construction-worker	{"strength":4,"shooting":1,"agility":3,"intelligence":3,"charisma":1,"constitution":1}		0	5	2	100	10	100	\N	\N	\N	\N	{"armor": null, "boots": null, "helmet": null, "primary_weapon": null, "secondary_weapon": null}
\.


--
-- TOC entry 2995 (class 0 OID 16548)
-- Dependencies: 203
-- Data for Name: intro_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.intro_images (id, link) FROM stdin;
1	https://drive.google.com/thumbnail?id=1BinJzbyz0_yz2SXrCUUa_TZ1WiGIPtj2
2	https://drive.google.com/thumbnail?id=14P3pQSlw0JPk5oYx7BLKjPH8fsPlkRWi
3	https://drive.google.com/thumbnail?id=1vbO4YHV2zACzuSh7HxaBV6T8BlyJyqFo
4	https://drive.google.com/thumbnail?id=1IV6QxBCyGgXnXwt2RBm-LgxLfdWkJERQ
5	https://drive.google.com/thumbnail?id=1esoD-Uz6kHCZ-au9k5bWoINEle07nYg5
\.


--
-- TOC entry 3014 (class 0 OID 16756)
-- Dependencies: 222
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory (id, character_id, primary_weapon_id, secondary_weapon_id, armor_id, quantity) FROM stdin;
\.


--
-- TOC entry 3010 (class 0 OID 16709)
-- Dependencies: 218
-- Data for Name: primary_weapon_and_attachments_junction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.primary_weapon_and_attachments_junction (weapon_id, attachment_id) FROM stdin;
\.


--
-- TOC entry 2999 (class 0 OID 16638)
-- Dependencies: 207
-- Data for Name: primary_weapons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.primary_weapons (id, name, description, damage_min, damage_max, critical_damage_max, critical_damage_min, critical_chance, image, type, attachments, weapon_category) FROM stdin;
1	FN FEL	The FN FEL, a rugged and reliable battle rifle. It offers pinpoint accuracy, a semi-automatic rate of fire, and high stopping power.	30	34	3	1	0.059999999999999998	https://i.imgur.com/2AU2Cyf.png	primary_weapon	\N	Semi-Automatic RIfle
3	M4B1 Carbine	A versatile, lightweight automatic rifle that excels in the chaotic environment of a post-apocalyptic zombie world. With its compact design this weapon is perfect for fast-paced encounters.	33	55	4	2	0	https://i.imgur.com/Y7TPTxd.png	primary_weapon	\N	Automatic Rifle
4	FN K90	A futuristic, compact submachine gun that delivers high-velocity shots capable of piercing through zombie skulls and even light body armor with ease.	28	30	4	2	0.070000000000000007	https://i.imgur.com/EGdyrMf.png	primary_weapon	\N	Submachine Gun
5	AL-47	A legendary symbol of rugged reliability. This assault rifle continues to function even after years of neglect and exposure to the elements. It's power and reliability make it ideal for defending against zombie hordes and hostile survivors alike.	29	34	5	1	0.050000000000000003	https://i.imgur.com/taPBfxN.png	primary_weapon	\N	Automatic Rifle
6	MP6	A compact, precise, and highly dependable weapon. It offers a balance between manageable firepower and surgical accuracy. Its low recoil and compact design make it easy to control.	22	25	2	3	0.02	https://i.imgur.com/e87BpFc.png	primary_weapon	\N	Submachine Gun
7	Schirtz TMP	A compact, fast-firing and lightweight weapon. Designed for close-quarters combat, where speed and maneuverability are essential for survival. Its compact frame allows it to be easily carried and drawn in a pinch.	15	19	2	2	0.040000000000000001	https://i.imgur.com/TnxfaFO.png	primary_weapon	\N	Submachine Gun
8	Mansberg 500	A reliable and hard-hitting pump-action shotgun. It delivers decent stopping power with each shot. Its pump-action mechanism is rugged and straightforward, making it incredibly reliable even after years of harsh weather, scavenging, and wear.	21	26	3	2	0.080000000000000002	https://i.imgur.com/1Wiv56O.png	primary_weapon	\N	Pump-Action Shotgun
9	Rollington 870	A workhorse pump-action shotgun with unmatched reliability and devastating close-range power. Whether you’re facing down a swarm of undead in a confined space or dealing with hostile survivors, Remington is built to handle the toughest situations.	25	28	2	4	0.059999999999999998	https://i.imgur.com/iPCf23l.png	primary_weapon	\N	Pump-Action Shotgun
10	Ferenchi SPAS-12	You need brutal stopping power and versatility at the same time ? SPAS-12 provides that and much more, enjoy the rain of flying limbs and organs as you plow through the wasteland with this ultimate tool of destruction! 	35	42	2	5	0.050000000000000003	https://i.imgur.com/y06pIW6.png	primary_weapon	\N	Semi-Automatic Shotgun
11	Rotgherr M77	A dependable bolt-action rifle that thrives in the harsh conditions of the wasteland. Good for hunting and playing whack-a-mole with the undead. Be on your toes against hordes though, it may pack a punch but you can't really rain fire and doom with it. 	28	33	8	4	0.01	https://i.imgur.com/WeqQqqt.png	primary_weapon	\N	Bolt-Action Rifle
13	Borietta M9	Ordinary pistol, used by the police forces before the outbreak. Doesn't offer a lot of damage, but it's realiable.	12	15	3	2	0.010999999999999999	https://i.imgur.com/Y0fTaon.png	primary_weapon	\N	Pistol
12	Wildling 110	Pinnacle of accuracy, a rugged bolt-action rifle with precision that would put anything else to shame. Put a scope on this weapon, you will win the post-apocalyptic head popping tournament with gold medal.	30	32	6	5	0.014999999999999999	https://i.imgur.com/dXiJmBH.png	primary_weapon	\N	Bolt-Action Rifle
14	Cleot M1911	This handgun delivers hard-hitting shots capable of dropping the undead with well-placed rounds to the head or putting down hostile survivors in close-quarters combat. Its timeless design and solid steel frame give it mythical durability.	14	17	4	1	0.089999999999999997	https://i.imgur.com/maocv4n.png	primary_weapon	\N	Pistol
15	Gallock 18	Fully automatic pistol that offers unparalleled firepower in the chaotic, fast-paced environment of a post-apocalyptic world. Its polymer frame and simple design ensure that it stays functional even in the harshest of conditions.	13	16	5	3	0.080000000000000002	https://i.imgur.com/FfGrj5K.png	primary_weapon	\N	Pistol
16	Sand Falcon	You want to see your enemies turned into pink mist, in expense of your joints and ears health ? Then lucky you have this fearsome, high-caliber handgun that stands out as a symbol of raw power and devastation. Nothing says "im scarier than you" than the Sand Falcon.	18	22	4	2	0.040000000000000001	https://i.imgur.com/ZKoXdos.png	primary_weapon	\N	Pistol
17	Mantum Snub-Nose	Have you ever dreamed of being a detective, but the outbreak put a break on those plans? Well, say welcome to this little hand cannon that turns heads (and explodes them) with its firepower, despite its deceptively compact size. It’s the kind of gun that screams, “I may be outnumbered, but I’m definitely not outgunned !”.	5	8	5	8	0.017000000000000001	https://i.imgur.com/eGdEVmw.png	primary_weapon	\N	Revolver
18	Cleot Serpent	The classy, smooth-talking gunslinger of the apocalypse. This revolver doesn't just kill the undead—it does it with style. Its sleek design, polished frame, and absurdly satisfying trigger pull make every shot feel like you’re starring in your own action movie, even if you’re just blowing the brains out of the undead next door.	12	17	4	6	0.016	https://i.imgur.com/jEN94Yp.png	primary_weapon	\N	Revolver
19	Carter & Lee Model 19	The revolver that says, "I came here to chew bubblegum and blast undead—and I’m all out of bubblegum...".  This classic piece of hardware is like the vintage muscle car of post-apocalyptic firearms: reliable, stylish, and loud enough to let everyone know you mean business.	11	15	3	4	0.017999999999999999	https://i.imgur.com/5oUQBLm.png	primary_weapon	\N	Revolver
20	Bullhorn 608	The revolver for those who believe that size indeed does matter. Meet the lovechild of a revolver and a tank—except this one fits in your hand and doesn’t need gas, just bullets. With its massive frame, thunderous recoil, and extra 8 rounds barrel, you’ll not only survive the apocalypse—you’ll dominate it, one obliterated zombie at a time.	18	22	2	4	0.010999999999999999	https://i.imgur.com/oNjF1xA.png	primary_weapon	\N	Revolver
\.


--
-- TOC entry 3011 (class 0 OID 16724)
-- Dependencies: 219
-- Data for Name: secondary_weapon_and_attachments_junction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.secondary_weapon_and_attachments_junction (weapon_id, attachment_id) FROM stdin;
\.


--
-- TOC entry 3001 (class 0 OID 16652)
-- Dependencies: 209
-- Data for Name: secondary_weapons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.secondary_weapons (id, name, description, damage_min, damage_max, critical_damage_max, critical_damage_min, critical_chance, image, type, attachments, weapon_category) FROM stdin;
1	Kitchen Knife	When you’re not fighting for your life, it's great for slicing through stale bread or opening those mysterious, rusted cans you found in a long-abandoned pantry.	3	5	1	2	0.02	https://i.imgur.com/efnsEC7.png	secondary_weapon	\N	Short Blade
2	Hunting Knife	Whether you’re fending off the undead or carving up a questionable dinner, this blade is sharp enough to slice through zombie skulls and sturdy enough to double as a can opener when you’re in a pinch	5	7	2	3	0.040000000000000001	https://i.imgur.com/N3ORMKv.png	secondary_weapon	\N	Short Blade
3	Combat Knife	Lightweight and durable, it’s perfect for those tight situations where ammo is scarce and running is too cowardly. Whether you're slashing, stabbing, or just showing off some impressive knife twirls in front of the campfire, this piece of craftsmanship got you covered.	8	10	4	1	0.080000000000000002	https://i.imgur.com/3jRGT16.png	secondary_weapon	\N	Short Blade
4	Machete	Meet the answer to, “What if I want to clear brush and decapitate the undead, all in one swift motion?” This oversized blade isn’t just a tool—it’s a lifestyle. Whether you’re slicing through dense forest brush, overgrown city streets, or the necks of unfortunate zombies, it gets the job done with style and flair.	11	13	2	4	0.017999999999999999	https://i.imgur.com/gQJQpZZ.png	secondary_weapon	\N	Long Blade
5	Katana	Forget guns and explosives—this is the weapon of choice for those who think the best way to deal with zombies is to slice them in half while looking like they’ve stepped straight out of an action movie. Decapitating the undead is more than just a survival tactic—it’s an art form. (Probably replica, not a real samurai katana)	22	30	5	6	0.029999999999999999	https://i.imgur.com/Om3Uvv6.png	secondary_weapon	\N	Long Blade
6	Hand Axe	This trusty, compact weapon is lightweight and easy to swing, it’s perfect for those who prefer to get up close and personal with the undead. Just one good swing, and you’re ready to turn any zombie encounter into a gore-filled lumberjack session.	14	16	2	3	0.059999999999999998	https://i.imgur.com/WuZIpCl.png	secondary_weapon	\N	Axe
7	Wood Axe	Ever wanted to bring a little lumberjack energy to the apocalypse? This beast got you covered. It isn’t just a tool - it’s a statement. And that statement is: "I’m here to chop wood, and if undead get in my way, well, they’re just bonus firewood." Whether you’re felling trees for your  cabin or turning a horde into confetti, it delivers both utility and over-the-top destruction in one mighty swing.	18	25	4	2	0.089999999999999997	https://i.imgur.com/e0cNQny.png	secondary_weapon	\N	Axe
8	Fire Axe	When subtlety isn’t your style and the apocalypse is just another day on the job. Originally designed to smash through doors and rescue people from burning buildings, this tool has found its true calling in the post-outbreak world: smashing through undead skulls with fiery enthusiasm.	23	27	3	2	0.02	https://i.imgur.com/lbo78ol.png	secondary_weapon	\N	Axe
9	Hammer	The ultimate “I’ve had enough of this” weapon. Originally intended for home repairs, this trusty tool has found a new life as the weapon of choice for survivors who believe that the undead problem can be solved one head at a time—literally. Need to secure a barricade? Great. Need to smash a skull in the process? Even better. The hammer is your all-in-one apocalypse multitool for when life falls apart.	7	11	6	3	0.089999999999999997	https://i.imgur.com/UH09zyu.png	secondary_weapon	\N	Short Blunt
10	Metal Pipe	 You like your tools blunt and your solutions even blunter ? Here comes the metal pipe. This isn’t just a piece of scrap metal—it’s your best friend when you’re fresh out of ammo and surrounded by undead who kinda forgot that "personal space" is a thing.	6	13	1	4	0.010999999999999999	https://i.imgur.com/EUOQRwi.png	secondary_weapon	\N	Short Blunt
11	Pipe Wrench	The heavyweight champion of improvised apocalypse weaponry, perfect for the survivor who wants to fix leaky pipes and crush skulls with equal efficiency.	11	17	2	5	0.014999999999999999	https://i.imgur.com/21dRksD.png	secondary_weapon	\N	Short Blunt
12	Crowbar	The ultimate “do-it-all” tool of the apocalypse. Undead? Crowbar. Locked door? Crowbar. Need to assert dominance in a post-apocalyptic poker game? You guessed it—crowbar.	12	19	3	5	0.070000000000000007	https://i.imgur.com/L4pmy1T.png	secondary_weapon	\N	Long Blunt
13	Baseball Bat	Whether you were the MVP of your local softball league or haven't touched a bat since gym class, this beauty makes everyone feel like a pro when it comes to delivering brain-busting hits.	17	20	2	3	0.010999999999999999	https://i.imgur.com/tUudbO2.png	secondary_weapon	\N	Long Blunt
14	Shovel	Need to bury a body? Great. Need to make a body? Even better. This trusty, all-purpose digging device is here to remind you to keep things simple. Smack with the flat side and dig graves with the other.	21	24	2	1	0.025000000000000001	https://i.imgur.com/KfCWwEU.png	secondary_weapon	\N	Long Blunt
15	Wooden Spear	Do you believe in a little bit of old-school flair? Well you are going back to basics with this one—way back, like caveman-level back. Sure, it's not\nflashy or stylish but when it comes to poking undead from a safe distance, the spear is an absolute masterpiece of low-tech ingenuity.	8	11	5	6	0.017000000000000001	https://i.imgur.com/AhbQYN0.png	secondary_weapon	\N	Spear
16	Garden Fork	Nothing says “Stay out of my garden” like a undead pinned to the ground like an oversized compost heap. Originally designed for turning soil and digging up potatoes, this trusty, four-pronged pitchfork of doom has quickly found its place as a dual-purpose undead-slaying masterpiece. 	14	19	5	2	0.014	https://i.imgur.com/7q8KSPc.png	secondary_weapon	\N	Spear
17	Pike Pole	Why get up close and personal when you can send the undead to their eternal rest from across the street? With its long, sturdy pole and sharp, menacing hook at the end, the pike pole is perfect for keeping the undead at a safe distance.	16	18	4	3	0.016	https://i.imgur.com/2jjwwZR.png	secondary_weapon	\N	Spear
\.


--
-- TOC entry 2993 (class 0 OID 16521)
-- Dependencies: 201
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.session (sid, sess, expire) FROM stdin;
c7e344ee-5163-4a34-968b-51b2aa1c9317	{"cookie":{"originalMaxAge":3600000,"expires":"2024-08-28T17:56:01.983Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"userData":{"userID":24,"username":"johan","email":"johan@gmail.com","secret":"$2a$10$mq0o9ZbMt4yA8J9NXprQYe9KP7JU8qKHvldE3Ejj/toSIzUtkkvJm"}}	2024-08-28 20:57:28
\.


--
-- TOC entry 2989 (class 0 OID 16396)
-- Dependencies: 197
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password, created_at, session_secret, has_created_character, profile_picture) FROM stdin;
20	alexander	alex@gmail.com	$2a$10$Al/ICuN7c/J97hnCHfBOsuCXvhXh2PRCvUwg3pGvlXZYhkXfMJk3a	2024-08-28 14:47:58.045254	$2a$10$Q/Qxn03tkFXUdDKxrFeLoO570gQsRv8.4l5YVXxReDHZkPffbPh5C	t	https://drive.google.com/thumbnail?id=1C3m0pTQTH0dyhzGlpUVnqN0vqCfvECj2
21	asdasd	asd@gmail.com	$2a$10$4dWvVRfWwEnC1gsNTtjUWOINGBC.LmE23dCtp161wcjyCPs/1M.l.	2024-08-28 14:48:58.807625	$2a$10$6Qar7ZSYTRC5kDdLCF2Kj.SfzhB03NK.j0HvlROoQ8wIuRgfrqGAK	f	https://drive.google.com/thumbnail?id=1C3m0pTQTH0dyhzGlpUVnqN0vqCfvECj2
22	asdasd	asd@gmail.com	$2a$10$ieK8IMRyqCfi5ts3IeskTOEJCG3C3Wi5vTRNBUMQczFtgMEKI.4Yi	2024-08-28 14:48:58.976749	$2a$10$rH25IJnOY63dN6tZM49la.AbkhKRZMkevb6KhItYX9pTUAYEhHJmW	t	https://drive.google.com/thumbnail?id=1C3m0pTQTH0dyhzGlpUVnqN0vqCfvECj2
23	peter	peter@gmail.com	$2a$10$lrg6zeJWaI45VEWKljp7Qe7IsmSYU49kkFtnFpD3iDOAjNtn9tcr6	2024-08-28 14:50:37.788176	$2a$10$DbJ1rVLJF0TBaGIf6kNenulccEeksOecyRHp/kZyTzxxgjYmQJdtq	t	https://drive.google.com/thumbnail?id=1C3m0pTQTH0dyhzGlpUVnqN0vqCfvECj2
24	johan	johan@gmail.com	$2a$10$MPrRA3.6im8U3Jeh5/WCSeO6Ct8y6YJt5fbo39wkKEtu.AtSDkkgK	2024-08-28 19:56:02.162159	$2a$10$mq0o9ZbMt4yA8J9NXprQYe9KP7JU8qKHvldE3Ejj/toSIzUtkkvJm	t	https://drive.google.com/thumbnail?id=1C3m0pTQTH0dyhzGlpUVnqN0vqCfvECj2
\.


--
-- TOC entry 2997 (class 0 OID 16626)
-- Dependencies: 205
-- Data for Name: zombies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.zombies (id, name, description, damage_min, critical_damage_min, damage_max, critical_damage_max, critical_chance, health_min, health_max, type) FROM stdin;
1	Shambler	A rotten corpse barely moving around, one of the first infected when the outbreak hit.	1	1	5	6	0.02	20	30	Normal
\.


--
-- TOC entry 3032 (class 0 OID 0)
-- Dependencies: 210
-- Name: armor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.armor_id_seq', 12, true);


--
-- TOC entry 3033 (class 0 OID 0)
-- Dependencies: 216
-- Name: attachments_armor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attachments_armor_id_seq', 6, true);


--
-- TOC entry 3034 (class 0 OID 0)
-- Dependencies: 212
-- Name: attachments_primary_weapon_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attachments_primary_weapon_id_seq', 17, true);


--
-- TOC entry 3035 (class 0 OID 0)
-- Dependencies: 214
-- Name: attachments_secondary_weapon_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attachments_secondary_weapon_id_seq', 6, true);


--
-- TOC entry 3036 (class 0 OID 0)
-- Dependencies: 199
-- Name: characters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.characters_id_seq', 11, true);


--
-- TOC entry 3037 (class 0 OID 0)
-- Dependencies: 202
-- Name: intro_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.intro_images_id_seq', 6, true);


--
-- TOC entry 3038 (class 0 OID 0)
-- Dependencies: 221
-- Name: inventory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventory_id_seq', 1, false);


--
-- TOC entry 3039 (class 0 OID 0)
-- Dependencies: 206
-- Name: primary_weapons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.primary_weapons_id_seq', 20, true);


--
-- TOC entry 3040 (class 0 OID 0)
-- Dependencies: 208
-- Name: secondary_weapons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.secondary_weapons_id_seq', 17, true);


--
-- TOC entry 3041 (class 0 OID 0)
-- Dependencies: 196
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 24, true);


--
-- TOC entry 3042 (class 0 OID 0)
-- Dependencies: 204
-- Name: zombies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.zombies_id_seq', 1, true);


--
-- TOC entry 2840 (class 2606 OID 16743)
-- Name: armor_and_attachments_junction armor_and_attachments_junction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.armor_and_attachments_junction
    ADD CONSTRAINT armor_and_attachments_junction_pkey PRIMARY KEY (armor_id, attachment_id);


--
-- TOC entry 2828 (class 2606 OID 16674)
-- Name: armor armor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.armor
    ADD CONSTRAINT armor_pkey PRIMARY KEY (id);


--
-- TOC entry 2834 (class 2606 OID 16708)
-- Name: attachments_armor attachments_armor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attachments_armor
    ADD CONSTRAINT attachments_armor_pkey PRIMARY KEY (id);


--
-- TOC entry 2830 (class 2606 OID 16685)
-- Name: attachments_primary_weapon attachments_primary_weapon_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attachments_primary_weapon
    ADD CONSTRAINT attachments_primary_weapon_pkey PRIMARY KEY (id);


--
-- TOC entry 2832 (class 2606 OID 16696)
-- Name: attachments_secondary_weapon attachments_secondary_weapon_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attachments_secondary_weapon
    ADD CONSTRAINT attachments_secondary_weapon_pkey PRIMARY KEY (id);


--
-- TOC entry 2813 (class 2606 OID 16430)
-- Name: avatars avatars_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avatars
    ADD CONSTRAINT avatars_pkey PRIMARY KEY (id);


--
-- TOC entry 2815 (class 2606 OID 16443)
-- Name: characters characters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.characters
    ADD CONSTRAINT characters_pkey PRIMARY KEY (id);


--
-- TOC entry 2820 (class 2606 OID 16553)
-- Name: intro_images intro_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.intro_images
    ADD CONSTRAINT intro_images_pkey PRIMARY KEY (id);


--
-- TOC entry 2842 (class 2606 OID 16762)
-- Name: inventory inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (id);


--
-- TOC entry 2836 (class 2606 OID 16713)
-- Name: primary_weapon_and_attachments_junction primary_weapon_and_attachments_junction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.primary_weapon_and_attachments_junction
    ADD CONSTRAINT primary_weapon_and_attachments_junction_pkey PRIMARY KEY (weapon_id, attachment_id);


--
-- TOC entry 2824 (class 2606 OID 16649)
-- Name: primary_weapons primary_weapons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.primary_weapons
    ADD CONSTRAINT primary_weapons_pkey PRIMARY KEY (id);


--
-- TOC entry 2838 (class 2606 OID 16728)
-- Name: secondary_weapon_and_attachments_junction secondary_weapon_and_attachments_junction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.secondary_weapon_and_attachments_junction
    ADD CONSTRAINT secondary_weapon_and_attachments_junction_pkey PRIMARY KEY (weapon_id, attachment_id);


--
-- TOC entry 2826 (class 2606 OID 16663)
-- Name: secondary_weapons secondary_weapons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.secondary_weapons
    ADD CONSTRAINT secondary_weapons_pkey PRIMARY KEY (id);


--
-- TOC entry 2818 (class 2606 OID 16528)
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- TOC entry 2811 (class 2606 OID 16402)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 2822 (class 2606 OID 16631)
-- Name: zombies zombies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zombies
    ADD CONSTRAINT zombies_pkey PRIMARY KEY (id);


--
-- TOC entry 2816 (class 1259 OID 16529)
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_session_expire" ON public.session USING btree (expire);


--
-- TOC entry 2855 (class 2620 OID 16607)
-- Name: characters experience_update_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER experience_update_trigger BEFORE INSERT OR UPDATE OF experience ON public.characters FOR EACH ROW EXECUTE PROCEDURE public.update_level_based_on_experience();


--
-- TOC entry 2856 (class 2620 OID 16604)
-- Name: characters level_update_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER level_update_trigger BEFORE INSERT OR UPDATE OF level ON public.characters FOR EACH ROW EXECUTE PROCEDURE public.update_experience_to_next_level();


--
-- TOC entry 2857 (class 2620 OID 16621)
-- Name: characters update_critical_chance_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_critical_chance_trigger BEFORE INSERT OR UPDATE OF level, skills ON public.characters FOR EACH ROW EXECUTE PROCEDURE public.update_critical_chance();


--
-- TOC entry 2858 (class 2620 OID 16617)
-- Name: characters update_critical_primary; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_critical_primary BEFORE INSERT OR UPDATE OF base_damage_primary ON public.characters FOR EACH ROW EXECUTE PROCEDURE public.update_critical_damage_primary();


--
-- TOC entry 2859 (class 2620 OID 16619)
-- Name: characters update_critical_secondary; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_critical_secondary BEFORE INSERT OR UPDATE OF base_damage_secondary ON public.characters FOR EACH ROW EXECUTE PROCEDURE public.update_critical_damage_secondary();


--
-- TOC entry 2860 (class 2620 OID 16623)
-- Name: characters update_dodge_chance_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_dodge_chance_trigger BEFORE INSERT OR UPDATE OF level, skills ON public.characters FOR EACH ROW EXECUTE PROCEDURE public.update_dodge_chance();


--
-- TOC entry 2861 (class 2620 OID 16610)
-- Name: characters update_health_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_health_trigger BEFORE INSERT OR UPDATE OF level, skills ON public.characters FOR EACH ROW EXECUTE PROCEDURE public.update_health_based_on_level_and_constitution();


--
-- TOC entry 2862 (class 2620 OID 16612)
-- Name: characters update_primary_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_primary_trigger BEFORE INSERT OR UPDATE OF level, skills ON public.characters FOR EACH ROW EXECUTE PROCEDURE public.update_primary_based_on_level_and_shooting();


--
-- TOC entry 2863 (class 2620 OID 16614)
-- Name: characters update_secondary_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_secondary_trigger BEFORE INSERT OR UPDATE OF level, skills ON public.characters FOR EACH ROW EXECUTE PROCEDURE public.update_secondary_based_on_level_and_strength();


--
-- TOC entry 2865 (class 2620 OID 16633)
-- Name: zombies update_zombie_crit_damage_max_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_zombie_crit_damage_max_trigger BEFORE INSERT OR UPDATE OF damage_max ON public.zombies FOR EACH ROW EXECUTE PROCEDURE public.update_zombie_critical_damage_max();


--
-- TOC entry 2866 (class 2620 OID 16635)
-- Name: zombies update_zombie_crit_min; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_zombie_crit_min BEFORE INSERT OR UPDATE OF damage_min ON public.zombies FOR EACH ROW EXECUTE PROCEDURE public.update_zombie_critical_damage_min();


--
-- TOC entry 2864 (class 2620 OID 16794)
-- Name: characters validate_equipment_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER validate_equipment_trigger BEFORE INSERT OR UPDATE OF equipment ON public.characters FOR EACH ROW EXECUTE PROCEDURE public.validate_equipment();


--
-- TOC entry 2849 (class 2606 OID 16744)
-- Name: armor_and_attachments_junction armor_and_attachments_junction_armor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.armor_and_attachments_junction
    ADD CONSTRAINT armor_and_attachments_junction_armor_id_fkey FOREIGN KEY (armor_id) REFERENCES public.armor(id) ON DELETE CASCADE;


--
-- TOC entry 2850 (class 2606 OID 16749)
-- Name: armor_and_attachments_junction armor_and_attachments_junction_attachment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.armor_and_attachments_junction
    ADD CONSTRAINT armor_and_attachments_junction_attachment_id_fkey FOREIGN KEY (attachment_id) REFERENCES public.attachments_armor(id) ON DELETE CASCADE;


--
-- TOC entry 2843 (class 2606 OID 16449)
-- Name: characters characters_avatar_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.characters
    ADD CONSTRAINT characters_avatar_id_fkey FOREIGN KEY (avatar_id) REFERENCES public.avatars(id);


--
-- TOC entry 2844 (class 2606 OID 16444)
-- Name: characters characters_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.characters
    ADD CONSTRAINT characters_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 2851 (class 2606 OID 16778)
-- Name: inventory inventory_armor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_armor_id_fkey FOREIGN KEY (armor_id) REFERENCES public.armor(id) ON DELETE SET NULL;


--
-- TOC entry 2852 (class 2606 OID 16763)
-- Name: inventory inventory_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id) ON DELETE CASCADE;


--
-- TOC entry 2853 (class 2606 OID 16768)
-- Name: inventory inventory_primary_weapon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_primary_weapon_id_fkey FOREIGN KEY (primary_weapon_id) REFERENCES public.primary_weapons(id) ON DELETE SET NULL;


--
-- TOC entry 2854 (class 2606 OID 16773)
-- Name: inventory inventory_secondary_weapon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_secondary_weapon_id_fkey FOREIGN KEY (secondary_weapon_id) REFERENCES public.secondary_weapons(id) ON DELETE SET NULL;


--
-- TOC entry 2845 (class 2606 OID 16719)
-- Name: primary_weapon_and_attachments_junction primary_weapon_and_attachments_junction_attachment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.primary_weapon_and_attachments_junction
    ADD CONSTRAINT primary_weapon_and_attachments_junction_attachment_id_fkey FOREIGN KEY (attachment_id) REFERENCES public.attachments_primary_weapon(id) ON DELETE CASCADE;


--
-- TOC entry 2846 (class 2606 OID 16714)
-- Name: primary_weapon_and_attachments_junction primary_weapon_and_attachments_junction_weapon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.primary_weapon_and_attachments_junction
    ADD CONSTRAINT primary_weapon_and_attachments_junction_weapon_id_fkey FOREIGN KEY (weapon_id) REFERENCES public.primary_weapons(id) ON DELETE CASCADE;


--
-- TOC entry 2847 (class 2606 OID 16734)
-- Name: secondary_weapon_and_attachments_junction secondary_weapon_and_attachments_junction_attachment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.secondary_weapon_and_attachments_junction
    ADD CONSTRAINT secondary_weapon_and_attachments_junction_attachment_id_fkey FOREIGN KEY (attachment_id) REFERENCES public.attachments_secondary_weapon(id) ON DELETE CASCADE;


--
-- TOC entry 2848 (class 2606 OID 16729)
-- Name: secondary_weapon_and_attachments_junction secondary_weapon_and_attachments_junction_weapon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.secondary_weapon_and_attachments_junction
    ADD CONSTRAINT secondary_weapon_and_attachments_junction_weapon_id_fkey FOREIGN KEY (weapon_id) REFERENCES public.secondary_weapons(id) ON DELETE CASCADE;


--
-- TOC entry 3020 (class 0 OID 0)
-- Dependencies: 6
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2024-09-10 18:14:04

--
-- PostgreSQL database dump complete
--

