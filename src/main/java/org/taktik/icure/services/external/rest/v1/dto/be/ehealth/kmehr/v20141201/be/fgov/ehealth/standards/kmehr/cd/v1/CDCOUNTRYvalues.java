/*
 * Copyright (C) 2018 Taktik SA
 *
 * This file is part of iCureBackend.
 *
 * iCureBackend is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * iCureBackend is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with iCureBackend.  If not, see <http://www.gnu.org/licenses/>.
 */

//
// Ce fichier a été généré par l'implémentation de référence JavaTM Architecture for XML Binding (JAXB), v2.2.8-b130911.1802 
// Voir <a href="http://java.sun.com/xml/jaxb">http://java.sun.com/xml/jaxb</a> 
// Toute modification apportée à ce fichier sera perdue lors de la recompilation du schéma source. 
// Généré le : 2015.03.05 à 11:48:22 AM CET 
//


package org.taktik.icure.services.external.rest.v1.dto.be.ehealth.kmehr.v20141201.be.fgov.ehealth.standards.kmehr.cd.v1;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Classe Java pour CD-COUNTRYvalues.
 * 
 * <p>Le fragment de schéma suivant indique le contenu attendu figurant dans cette classe.
 * <p>
 * <pre>
 * &lt;simpleType name="CD-COUNTRYvalues">
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *     &lt;enumeration value="ad"/>
 *     &lt;enumeration value="ae"/>
 *     &lt;enumeration value="af"/>
 *     &lt;enumeration value="ag"/>
 *     &lt;enumeration value="ai"/>
 *     &lt;enumeration value="al"/>
 *     &lt;enumeration value="am"/>
 *     &lt;enumeration value="an"/>
 *     &lt;enumeration value="ao"/>
 *     &lt;enumeration value="aq"/>
 *     &lt;enumeration value="ar"/>
 *     &lt;enumeration value="arpa"/>
 *     &lt;enumeration value="as"/>
 *     &lt;enumeration value="at"/>
 *     &lt;enumeration value="au"/>
 *     &lt;enumeration value="aw"/>
 *     &lt;enumeration value="az"/>
 *     &lt;enumeration value="ba"/>
 *     &lt;enumeration value="bb"/>
 *     &lt;enumeration value="bd"/>
 *     &lt;enumeration value="be"/>
 *     &lt;enumeration value="bf"/>
 *     &lt;enumeration value="bg"/>
 *     &lt;enumeration value="bh"/>
 *     &lt;enumeration value="bi"/>
 *     &lt;enumeration value="bj"/>
 *     &lt;enumeration value="bm"/>
 *     &lt;enumeration value="bn"/>
 *     &lt;enumeration value="bo"/>
 *     &lt;enumeration value="br"/>
 *     &lt;enumeration value="bs"/>
 *     &lt;enumeration value="bt"/>
 *     &lt;enumeration value="bv"/>
 *     &lt;enumeration value="bw"/>
 *     &lt;enumeration value="by"/>
 *     &lt;enumeration value="bz"/>
 *     &lt;enumeration value="ca"/>
 *     &lt;enumeration value="cc"/>
 *     &lt;enumeration value="cf"/>
 *     &lt;enumeration value="cd"/>
 *     &lt;enumeration value="cg"/>
 *     &lt;enumeration value="ch"/>
 *     &lt;enumeration value="ci"/>
 *     &lt;enumeration value="ck"/>
 *     &lt;enumeration value="cl"/>
 *     &lt;enumeration value="cm"/>
 *     &lt;enumeration value="cn"/>
 *     &lt;enumeration value="co"/>
 *     &lt;enumeration value="com"/>
 *     &lt;enumeration value="cr"/>
 *     &lt;enumeration value="cs"/>
 *     &lt;enumeration value="cu"/>
 *     &lt;enumeration value="cv"/>
 *     &lt;enumeration value="cx"/>
 *     &lt;enumeration value="cy"/>
 *     &lt;enumeration value="cz"/>
 *     &lt;enumeration value="de"/>
 *     &lt;enumeration value="dj"/>
 *     &lt;enumeration value="dk"/>
 *     &lt;enumeration value="dm"/>
 *     &lt;enumeration value="do"/>
 *     &lt;enumeration value="dz"/>
 *     &lt;enumeration value="ec"/>
 *     &lt;enumeration value="edu"/>
 *     &lt;enumeration value="ee"/>
 *     &lt;enumeration value="eg"/>
 *     &lt;enumeration value="eh"/>
 *     &lt;enumeration value="er"/>
 *     &lt;enumeration value="es"/>
 *     &lt;enumeration value="et"/>
 *     &lt;enumeration value="fi"/>
 *     &lt;enumeration value="fj"/>
 *     &lt;enumeration value="fk"/>
 *     &lt;enumeration value="fm"/>
 *     &lt;enumeration value="fo"/>
 *     &lt;enumeration value="fr"/>
 *     &lt;enumeration value="fx"/>
 *     &lt;enumeration value="ga"/>
 *     &lt;enumeration value="gb"/>
 *     &lt;enumeration value="gd"/>
 *     &lt;enumeration value="ge"/>
 *     &lt;enumeration value="gf"/>
 *     &lt;enumeration value="gh"/>
 *     &lt;enumeration value="gi"/>
 *     &lt;enumeration value="gl"/>
 *     &lt;enumeration value="gm"/>
 *     &lt;enumeration value="gn"/>
 *     &lt;enumeration value="gov"/>
 *     &lt;enumeration value="gp"/>
 *     &lt;enumeration value="gr"/>
 *     &lt;enumeration value="gs"/>
 *     &lt;enumeration value="gt"/>
 *     &lt;enumeration value="gu"/>
 *     &lt;enumeration value="gw"/>
 *     &lt;enumeration value="gy"/>
 *     &lt;enumeration value="hk"/>
 *     &lt;enumeration value="hm"/>
 *     &lt;enumeration value="hn"/>
 *     &lt;enumeration value="hr"/>
 *     &lt;enumeration value="ht"/>
 *     &lt;enumeration value="hu"/>
 *     &lt;enumeration value="id"/>
 *     &lt;enumeration value="ie"/>
 *     &lt;enumeration value="il"/>
 *     &lt;enumeration value="in"/>
 *     &lt;enumeration value="int"/>
 *     &lt;enumeration value="io"/>
 *     &lt;enumeration value="iq"/>
 *     &lt;enumeration value="ir"/>
 *     &lt;enumeration value="is"/>
 *     &lt;enumeration value="it"/>
 *     &lt;enumeration value="jm"/>
 *     &lt;enumeration value="jo"/>
 *     &lt;enumeration value="jp"/>
 *     &lt;enumeration value="ke"/>
 *     &lt;enumeration value="kg"/>
 *     &lt;enumeration value="kh"/>
 *     &lt;enumeration value="ki"/>
 *     &lt;enumeration value="km"/>
 *     &lt;enumeration value="kn"/>
 *     &lt;enumeration value="kp"/>
 *     &lt;enumeration value="kr"/>
 *     &lt;enumeration value="kw"/>
 *     &lt;enumeration value="ky"/>
 *     &lt;enumeration value="kz"/>
 *     &lt;enumeration value="la"/>
 *     &lt;enumeration value="lb"/>
 *     &lt;enumeration value="lc"/>
 *     &lt;enumeration value="li"/>
 *     &lt;enumeration value="lk"/>
 *     &lt;enumeration value="ls"/>
 *     &lt;enumeration value="lt"/>
 *     &lt;enumeration value="lu"/>
 *     &lt;enumeration value="lv"/>
 *     &lt;enumeration value="ly"/>
 *     &lt;enumeration value="ma"/>
 *     &lt;enumeration value="mc"/>
 *     &lt;enumeration value="md"/>
 *     &lt;enumeration value="mg"/>
 *     &lt;enumeration value="mh"/>
 *     &lt;enumeration value="mil"/>
 *     &lt;enumeration value="mk"/>
 *     &lt;enumeration value="ml"/>
 *     &lt;enumeration value="mm"/>
 *     &lt;enumeration value="mn"/>
 *     &lt;enumeration value="mo"/>
 *     &lt;enumeration value="mp"/>
 *     &lt;enumeration value="mq"/>
 *     &lt;enumeration value="mr"/>
 *     &lt;enumeration value="ms"/>
 *     &lt;enumeration value="mt"/>
 *     &lt;enumeration value="mu"/>
 *     &lt;enumeration value="mv"/>
 *     &lt;enumeration value="mw"/>
 *     &lt;enumeration value="mx"/>
 *     &lt;enumeration value="my"/>
 *     &lt;enumeration value="mz"/>
 *     &lt;enumeration value="na"/>
 *     &lt;enumeration value="nato"/>
 *     &lt;enumeration value="nc"/>
 *     &lt;enumeration value="ne"/>
 *     &lt;enumeration value="net"/>
 *     &lt;enumeration value="nf"/>
 *     &lt;enumeration value="ng"/>
 *     &lt;enumeration value="ni"/>
 *     &lt;enumeration value="nl"/>
 *     &lt;enumeration value="no"/>
 *     &lt;enumeration value="np"/>
 *     &lt;enumeration value="nr"/>
 *     &lt;enumeration value="nt"/>
 *     &lt;enumeration value="nu"/>
 *     &lt;enumeration value="nz"/>
 *     &lt;enumeration value="om"/>
 *     &lt;enumeration value="org"/>
 *     &lt;enumeration value="pa"/>
 *     &lt;enumeration value="pe"/>
 *     &lt;enumeration value="pf"/>
 *     &lt;enumeration value="pg"/>
 *     &lt;enumeration value="ph"/>
 *     &lt;enumeration value="pk"/>
 *     &lt;enumeration value="pl"/>
 *     &lt;enumeration value="pm"/>
 *     &lt;enumeration value="pn"/>
 *     &lt;enumeration value="pr"/>
 *     &lt;enumeration value="pt"/>
 *     &lt;enumeration value="pw"/>
 *     &lt;enumeration value="py"/>
 *     &lt;enumeration value="qa"/>
 *     &lt;enumeration value="re"/>
 *     &lt;enumeration value="ro"/>
 *     &lt;enumeration value="ru"/>
 *     &lt;enumeration value="rw"/>
 *     &lt;enumeration value="sa"/>
 *     &lt;enumeration value="sb"/>
 *     &lt;enumeration value="sc"/>
 *     &lt;enumeration value="sd"/>
 *     &lt;enumeration value="se"/>
 *     &lt;enumeration value="sg"/>
 *     &lt;enumeration value="sh"/>
 *     &lt;enumeration value="si"/>
 *     &lt;enumeration value="sj"/>
 *     &lt;enumeration value="sk"/>
 *     &lt;enumeration value="sl"/>
 *     &lt;enumeration value="sm"/>
 *     &lt;enumeration value="sn"/>
 *     &lt;enumeration value="so"/>
 *     &lt;enumeration value="sr"/>
 *     &lt;enumeration value="st"/>
 *     &lt;enumeration value="su"/>
 *     &lt;enumeration value="sv"/>
 *     &lt;enumeration value="sy"/>
 *     &lt;enumeration value="sz"/>
 *     &lt;enumeration value="tc"/>
 *     &lt;enumeration value="td"/>
 *     &lt;enumeration value="tf"/>
 *     &lt;enumeration value="tg"/>
 *     &lt;enumeration value="th"/>
 *     &lt;enumeration value="tj"/>
 *     &lt;enumeration value="tk"/>
 *     &lt;enumeration value="tm"/>
 *     &lt;enumeration value="tn"/>
 *     &lt;enumeration value="to"/>
 *     &lt;enumeration value="tp"/>
 *     &lt;enumeration value="tr"/>
 *     &lt;enumeration value="tt"/>
 *     &lt;enumeration value="tv"/>
 *     &lt;enumeration value="tw"/>
 *     &lt;enumeration value="tz"/>
 *     &lt;enumeration value="ua"/>
 *     &lt;enumeration value="ug"/>
 *     &lt;enumeration value="uk"/>
 *     &lt;enumeration value="um"/>
 *     &lt;enumeration value="us"/>
 *     &lt;enumeration value="uy"/>
 *     &lt;enumeration value="uz"/>
 *     &lt;enumeration value="va"/>
 *     &lt;enumeration value="vc"/>
 *     &lt;enumeration value="ve"/>
 *     &lt;enumeration value="vg"/>
 *     &lt;enumeration value="vi"/>
 *     &lt;enumeration value="vn"/>
 *     &lt;enumeration value="vu"/>
 *     &lt;enumeration value="wf"/>
 *     &lt;enumeration value="ws"/>
 *     &lt;enumeration value="ye"/>
 *     &lt;enumeration value="yt"/>
 *     &lt;enumeration value="yu"/>
 *     &lt;enumeration value="za"/>
 *     &lt;enumeration value="zm"/>
 *     &lt;enumeration value="zr"/>
 *     &lt;enumeration value="zw"/>
 *   &lt;/restriction>
 * &lt;/simpleType>
 * </pre>
 * 
 */
@XmlType(name = "CD-COUNTRYvalues")
@XmlEnum
public enum CDCOUNTRYvalues {

    @XmlEnumValue("ad")
    AD("ad"),
    @XmlEnumValue("ae")
    AE("ae"),
    @XmlEnumValue("af")
    AF("af"),
    @XmlEnumValue("ag")
    AG("ag"),
    @XmlEnumValue("ai")
    AI("ai"),
    @XmlEnumValue("al")
    AL("al"),
    @XmlEnumValue("am")
    AM("am"),
    @XmlEnumValue("an")
    AN("an"),
    @XmlEnumValue("ao")
    AO("ao"),
    @XmlEnumValue("aq")
    AQ("aq"),
    @XmlEnumValue("ar")
    AR("ar"),
    @XmlEnumValue("arpa")
    ARPA("arpa"),
    @XmlEnumValue("as")
    AS("as"),
    @XmlEnumValue("at")
    AT("at"),
    @XmlEnumValue("au")
    AU("au"),
    @XmlEnumValue("aw")
    AW("aw"),
    @XmlEnumValue("az")
    AZ("az"),
    @XmlEnumValue("ba")
    BA("ba"),
    @XmlEnumValue("bb")
    BB("bb"),
    @XmlEnumValue("bd")
    BD("bd"),
    @XmlEnumValue("be")
    BE("be"),
    @XmlEnumValue("bf")
    BF("bf"),
    @XmlEnumValue("bg")
    BG("bg"),
    @XmlEnumValue("bh")
    BH("bh"),
    @XmlEnumValue("bi")
    BI("bi"),
    @XmlEnumValue("bj")
    BJ("bj"),
    @XmlEnumValue("bm")
    BM("bm"),
    @XmlEnumValue("bn")
    BN("bn"),
    @XmlEnumValue("bo")
    BO("bo"),
    @XmlEnumValue("br")
    BR("br"),
    @XmlEnumValue("bs")
    BS("bs"),
    @XmlEnumValue("bt")
    BT("bt"),
    @XmlEnumValue("bv")
    BV("bv"),
    @XmlEnumValue("bw")
    BW("bw"),
    @XmlEnumValue("by")
    BY("by"),
    @XmlEnumValue("bz")
    BZ("bz"),
    @XmlEnumValue("ca")
    CA("ca"),
    @XmlEnumValue("cc")
    CC("cc"),
    @XmlEnumValue("cf")
    CF("cf"),
    @XmlEnumValue("cd")
    CD("cd"),
    @XmlEnumValue("cg")
    CG("cg"),
    @XmlEnumValue("ch")
    CH("ch"),
    @XmlEnumValue("ci")
    CI("ci"),
    @XmlEnumValue("ck")
    CK("ck"),
    @XmlEnumValue("cl")
    CL("cl"),
    @XmlEnumValue("cm")
    CM("cm"),
    @XmlEnumValue("cn")
    CN("cn"),
    @XmlEnumValue("co")
    CO("co"),
    @XmlEnumValue("com")
    COM("com"),
    @XmlEnumValue("cr")
    CR("cr"),
    @XmlEnumValue("cs")
    CS("cs"),
    @XmlEnumValue("cu")
    CU("cu"),
    @XmlEnumValue("cv")
    CV("cv"),
    @XmlEnumValue("cx")
    CX("cx"),
    @XmlEnumValue("cy")
    CY("cy"),
    @XmlEnumValue("cz")
    CZ("cz"),
    @XmlEnumValue("de")
    DE("de"),
    @XmlEnumValue("dj")
    DJ("dj"),
    @XmlEnumValue("dk")
    DK("dk"),
    @XmlEnumValue("dm")
    DM("dm"),
    @XmlEnumValue("do")
    DO("do"),
    @XmlEnumValue("dz")
    DZ("dz"),
    @XmlEnumValue("ec")
    EC("ec"),
    @XmlEnumValue("edu")
    EDU("edu"),
    @XmlEnumValue("ee")
    EE("ee"),
    @XmlEnumValue("eg")
    EG("eg"),
    @XmlEnumValue("eh")
    EH("eh"),
    @XmlEnumValue("er")
    ER("er"),
    @XmlEnumValue("es")
    ES("es"),
    @XmlEnumValue("et")
    ET("et"),
    @XmlEnumValue("fi")
    FI("fi"),
    @XmlEnumValue("fj")
    FJ("fj"),
    @XmlEnumValue("fk")
    FK("fk"),
    @XmlEnumValue("fm")
    FM("fm"),
    @XmlEnumValue("fo")
    FO("fo"),
    @XmlEnumValue("fr")
    FR("fr"),
    @XmlEnumValue("fx")
    FX("fx"),
    @XmlEnumValue("ga")
    GA("ga"),
    @XmlEnumValue("gb")
    GB("gb"),
    @XmlEnumValue("gd")
    GD("gd"),
    @XmlEnumValue("ge")
    GE("ge"),
    @XmlEnumValue("gf")
    GF("gf"),
    @XmlEnumValue("gh")
    GH("gh"),
    @XmlEnumValue("gi")
    GI("gi"),
    @XmlEnumValue("gl")
    GL("gl"),
    @XmlEnumValue("gm")
    GM("gm"),
    @XmlEnumValue("gn")
    GN("gn"),
    @XmlEnumValue("gov")
    GOV("gov"),
    @XmlEnumValue("gp")
    GP("gp"),
    @XmlEnumValue("gr")
    GR("gr"),
    @XmlEnumValue("gs")
    GS("gs"),
    @XmlEnumValue("gt")
    GT("gt"),
    @XmlEnumValue("gu")
    GU("gu"),
    @XmlEnumValue("gw")
    GW("gw"),
    @XmlEnumValue("gy")
    GY("gy"),
    @XmlEnumValue("hk")
    HK("hk"),
    @XmlEnumValue("hm")
    HM("hm"),
    @XmlEnumValue("hn")
    HN("hn"),
    @XmlEnumValue("hr")
    HR("hr"),
    @XmlEnumValue("ht")
    HT("ht"),
    @XmlEnumValue("hu")
    HU("hu"),
    @XmlEnumValue("id")
    ID("id"),
    @XmlEnumValue("ie")
    IE("ie"),
    @XmlEnumValue("il")
    IL("il"),
    @XmlEnumValue("in")
    IN("in"),
    @XmlEnumValue("int")
    INT("int"),
    @XmlEnumValue("io")
    IO("io"),
    @XmlEnumValue("iq")
    IQ("iq"),
    @XmlEnumValue("ir")
    IR("ir"),
    @XmlEnumValue("is")
    IS("is"),
    @XmlEnumValue("it")
    IT("it"),
    @XmlEnumValue("jm")
    JM("jm"),
    @XmlEnumValue("jo")
    JO("jo"),
    @XmlEnumValue("jp")
    JP("jp"),
    @XmlEnumValue("ke")
    KE("ke"),
    @XmlEnumValue("kg")
    KG("kg"),
    @XmlEnumValue("kh")
    KH("kh"),
    @XmlEnumValue("ki")
    KI("ki"),
    @XmlEnumValue("km")
    KM("km"),
    @XmlEnumValue("kn")
    KN("kn"),
    @XmlEnumValue("kp")
    KP("kp"),
    @XmlEnumValue("kr")
    KR("kr"),
    @XmlEnumValue("kw")
    KW("kw"),
    @XmlEnumValue("ky")
    KY("ky"),
    @XmlEnumValue("kz")
    KZ("kz"),
    @XmlEnumValue("la")
    LA("la"),
    @XmlEnumValue("lb")
    LB("lb"),
    @XmlEnumValue("lc")
    LC("lc"),
    @XmlEnumValue("li")
    LI("li"),
    @XmlEnumValue("lk")
    LK("lk"),
    @XmlEnumValue("ls")
    LS("ls"),
    @XmlEnumValue("lt")
    LT("lt"),
    @XmlEnumValue("lu")
    LU("lu"),
    @XmlEnumValue("lv")
    LV("lv"),
    @XmlEnumValue("ly")
    LY("ly"),
    @XmlEnumValue("ma")
    MA("ma"),
    @XmlEnumValue("mc")
    MC("mc"),
    @XmlEnumValue("md")
    MD("md"),
    @XmlEnumValue("mg")
    MG("mg"),
    @XmlEnumValue("mh")
    MH("mh"),
    @XmlEnumValue("mil")
    MIL("mil"),
    @XmlEnumValue("mk")
    MK("mk"),
    @XmlEnumValue("ml")
    ML("ml"),
    @XmlEnumValue("mm")
    MM("mm"),
    @XmlEnumValue("mn")
    MN("mn"),
    @XmlEnumValue("mo")
    MO("mo"),
    @XmlEnumValue("mp")
    MP("mp"),
    @XmlEnumValue("mq")
    MQ("mq"),
    @XmlEnumValue("mr")
    MR("mr"),
    @XmlEnumValue("ms")
    MS("ms"),
    @XmlEnumValue("mt")
    MT("mt"),
    @XmlEnumValue("mu")
    MU("mu"),
    @XmlEnumValue("mv")
    MV("mv"),
    @XmlEnumValue("mw")
    MW("mw"),
    @XmlEnumValue("mx")
    MX("mx"),
    @XmlEnumValue("my")
    MY("my"),
    @XmlEnumValue("mz")
    MZ("mz"),
    @XmlEnumValue("na")
    NA("na"),
    @XmlEnumValue("nato")
    NATO("nato"),
    @XmlEnumValue("nc")
    NC("nc"),
    @XmlEnumValue("ne")
    NE("ne"),
    @XmlEnumValue("net")
    NET("net"),
    @XmlEnumValue("nf")
    NF("nf"),
    @XmlEnumValue("ng")
    NG("ng"),
    @XmlEnumValue("ni")
    NI("ni"),
    @XmlEnumValue("nl")
    NL("nl"),
    @XmlEnumValue("no")
    NO("no"),
    @XmlEnumValue("np")
    NP("np"),
    @XmlEnumValue("nr")
    NR("nr"),
    @XmlEnumValue("nt")
    NT("nt"),
    @XmlEnumValue("nu")
    NU("nu"),
    @XmlEnumValue("nz")
    NZ("nz"),
    @XmlEnumValue("om")
    OM("om"),
    @XmlEnumValue("org")
    ORG("org"),
    @XmlEnumValue("pa")
    PA("pa"),
    @XmlEnumValue("pe")
    PE("pe"),
    @XmlEnumValue("pf")
    PF("pf"),
    @XmlEnumValue("pg")
    PG("pg"),
    @XmlEnumValue("ph")
    PH("ph"),
    @XmlEnumValue("pk")
    PK("pk"),
    @XmlEnumValue("pl")
    PL("pl"),
    @XmlEnumValue("pm")
    PM("pm"),
    @XmlEnumValue("pn")
    PN("pn"),
    @XmlEnumValue("pr")
    PR("pr"),
    @XmlEnumValue("pt")
    PT("pt"),
    @XmlEnumValue("pw")
    PW("pw"),
    @XmlEnumValue("py")
    PY("py"),
    @XmlEnumValue("qa")
    QA("qa"),
    @XmlEnumValue("re")
    RE("re"),
    @XmlEnumValue("ro")
    RO("ro"),
    @XmlEnumValue("ru")
    RU("ru"),
    @XmlEnumValue("rw")
    RW("rw"),
    @XmlEnumValue("sa")
    SA("sa"),
    @XmlEnumValue("sb")
    SB("sb"),
    @XmlEnumValue("sc")
    SC("sc"),
    @XmlEnumValue("sd")
    SD("sd"),
    @XmlEnumValue("se")
    SE("se"),
    @XmlEnumValue("sg")
    SG("sg"),
    @XmlEnumValue("sh")
    SH("sh"),
    @XmlEnumValue("si")
    SI("si"),
    @XmlEnumValue("sj")
    SJ("sj"),
    @XmlEnumValue("sk")
    SK("sk"),
    @XmlEnumValue("sl")
    SL("sl"),
    @XmlEnumValue("sm")
    SM("sm"),
    @XmlEnumValue("sn")
    SN("sn"),
    @XmlEnumValue("so")
    SO("so"),
    @XmlEnumValue("sr")
    SR("sr"),
    @XmlEnumValue("st")
    ST("st"),
    @XmlEnumValue("su")
    SU("su"),
    @XmlEnumValue("sv")
    SV("sv"),
    @XmlEnumValue("sy")
    SY("sy"),
    @XmlEnumValue("sz")
    SZ("sz"),
    @XmlEnumValue("tc")
    TC("tc"),
    @XmlEnumValue("td")
    TD("td"),
    @XmlEnumValue("tf")
    TF("tf"),
    @XmlEnumValue("tg")
    TG("tg"),
    @XmlEnumValue("th")
    TH("th"),
    @XmlEnumValue("tj")
    TJ("tj"),
    @XmlEnumValue("tk")
    TK("tk"),
    @XmlEnumValue("tm")
    TM("tm"),
    @XmlEnumValue("tn")
    TN("tn"),
    @XmlEnumValue("to")
    TO("to"),
    @XmlEnumValue("tp")
    TP("tp"),
    @XmlEnumValue("tr")
    TR("tr"),
    @XmlEnumValue("tt")
    TT("tt"),
    @XmlEnumValue("tv")
    TV("tv"),
    @XmlEnumValue("tw")
    TW("tw"),
    @XmlEnumValue("tz")
    TZ("tz"),
    @XmlEnumValue("ua")
    UA("ua"),
    @XmlEnumValue("ug")
    UG("ug"),
    @XmlEnumValue("uk")
    UK("uk"),
    @XmlEnumValue("um")
    UM("um"),
    @XmlEnumValue("us")
    US("us"),
    @XmlEnumValue("uy")
    UY("uy"),
    @XmlEnumValue("uz")
    UZ("uz"),
    @XmlEnumValue("va")
    VA("va"),
    @XmlEnumValue("vc")
    VC("vc"),
    @XmlEnumValue("ve")
    VE("ve"),
    @XmlEnumValue("vg")
    VG("vg"),
    @XmlEnumValue("vi")
    VI("vi"),
    @XmlEnumValue("vn")
    VN("vn"),
    @XmlEnumValue("vu")
    VU("vu"),
    @XmlEnumValue("wf")
    WF("wf"),
    @XmlEnumValue("ws")
    WS("ws"),
    @XmlEnumValue("ye")
    YE("ye"),
    @XmlEnumValue("yt")
    YT("yt"),
    @XmlEnumValue("yu")
    YU("yu"),
    @XmlEnumValue("za")
    ZA("za"),
    @XmlEnumValue("zm")
    ZM("zm"),
    @XmlEnumValue("zr")
    ZR("zr"),
    @XmlEnumValue("zw")
    ZW("zw");
    private final String value;

    CDCOUNTRYvalues(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static CDCOUNTRYvalues fromValue(String v) {
        for (CDCOUNTRYvalues c: CDCOUNTRYvalues.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
