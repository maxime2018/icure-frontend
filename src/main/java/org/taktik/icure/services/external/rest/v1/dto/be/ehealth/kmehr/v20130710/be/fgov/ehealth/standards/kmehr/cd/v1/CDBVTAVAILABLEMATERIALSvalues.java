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
// Généré le : 2015.03.05 à 11:48:09 AM CET 
//


package org.taktik.icure.services.external.rest.v1.dto.be.ehealth.kmehr.v20130710.be.fgov.ehealth.standards.kmehr.cd.v1;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Classe Java pour CD-BVT-AVAILABLEMATERIALSvalues.
 * 
 * <p>Le fragment de schéma suivant indique le contenu attendu figurant dans cette classe.
 * <p>
 * <pre>
 * &lt;simpleType name="CD-BVT-AVAILABLEMATERIALSvalues">
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *     &lt;enumeration value="cytology"/>
 *     &lt;enumeration value="dna"/>
 *     &lt;enumeration value="rna"/>
 *     &lt;enumeration value="proteins"/>
 *     &lt;enumeration value="correspondingnormaltissue"/>
 *     &lt;enumeration value="tissue"/>
 *     &lt;enumeration value="serum"/>
 *     &lt;enumeration value="plasma"/>
 *     &lt;enumeration value="blood"/>
 *     &lt;enumeration value="urine"/>
 *     &lt;enumeration value="other"/>
 *   &lt;/restriction>
 * &lt;/simpleType>
 * </pre>
 * 
 */
@XmlType(name = "CD-BVT-AVAILABLEMATERIALSvalues")
@XmlEnum
public enum CDBVTAVAILABLEMATERIALSvalues {

    @XmlEnumValue("cytology")
    CYTOLOGY("cytology"),
    @XmlEnumValue("dna")
    DNA("dna"),
    @XmlEnumValue("rna")
    RNA("rna"),
    @XmlEnumValue("proteins")
    PROTEINS("proteins"),
    @XmlEnumValue("correspondingnormaltissue")
    CORRESPONDINGNORMALTISSUE("correspondingnormaltissue"),
    @XmlEnumValue("tissue")
    TISSUE("tissue"),
    @XmlEnumValue("serum")
    SERUM("serum"),
    @XmlEnumValue("plasma")
    PLASMA("plasma"),
    @XmlEnumValue("blood")
    BLOOD("blood"),
    @XmlEnumValue("urine")
    URINE("urine"),
    @XmlEnumValue("other")
    OTHER("other");
    private final String value;

    CDBVTAVAILABLEMATERIALSvalues(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static CDBVTAVAILABLEMATERIALSvalues fromValue(String v) {
        for (CDBVTAVAILABLEMATERIALSvalues c: CDBVTAVAILABLEMATERIALSvalues.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
