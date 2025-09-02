package connect

import (
	"encoding/json"
	"fmt"
	"os"
	"regexp"
	"strings"

	ldap "github.com/go-ldap/ldap/v3"
)

type Attribute struct {
	NAME              []string
	SUP               string
	SINGLE_VALUE      bool
	USAGE             string
	USER_MODIFICATION bool
	DESC              string
}

type ObjectClass struct {
	NAME       string
	SUP        string
	DESC       string
	STRUCTURAL bool
	MUST       []string
	MAY        []string
}

type Schema struct {
	Attributes            []Attribute   `json:"attributes"`
	ObjectClasses         []ObjectClass `json:"objectclasses"`
	NotParseObjectClasses []string      `json:"notparseobjectclasses"`
	NotParseAttributes    []string      `json:"notparseattributes"`
}

func GetSchema(conn *ldap.Conn, baseDN string) (*Schema, error) {

	// Search for the given username
	searchRequest := ldap.NewSearchRequest(
		baseDN,
		ldap.ScopeBaseObject, ldap.NeverDerefAliases, 0, 0, false,
		"(objectClass=*)", []string{"attributeTypes", "objectClasses"}, nil,
	)

	sr, err := conn.Search(searchRequest)
	if err != nil {
		fmt.Println("CONN SEARCH ", err.Error())
		return nil, err
	}

	re2 := regexp.MustCompile(`'([0-9a-zA-Z_-]+?)'`)
	re3 := regexp.MustCompile(` ([0-9a-zA-Z_-]+?) `)

	schema := &Schema{}

	for _, v := range sr.Entries {
		attributeTypes := v.GetAttributeValues("attributeTypes")
		for _, a := range attributeTypes {

			var atribute Attribute
			// names := []string{}

			// Поиск имени атрибута
			reName := regexp.MustCompile(`NAME ('[0-9a-zA-Z_-]+?'|\(.+?\))`)
			matchedNameString := reName.FindString(a)
			if len(matchedNameString) > 0 {
				matchedNameArr := re2.FindAllStringSubmatch(matchedNameString, -1)
				if len(matchedNameArr) > 0 {
					for _, m := range matchedNameArr {
						atribute.NAME = append(atribute.NAME, m[1])
					}
				}
			}

			// Поиск описания атрибута
			reDesc := regexp.MustCompile(`DESC '(.*?)'`)
			matchedDescString := reDesc.FindStringSubmatch(a)
			if len(matchedDescString) > 0 {
				atribute.DESC = matchedDescString[1]
			}

			// Поиск суператрибута
			reSup := regexp.MustCompile(`SUP (.+?) `)
			matchedSupString := reSup.FindStringSubmatch(a)
			if len(matchedSupString) > 0 {
				atribute.SUP = matchedSupString[1]
			}

			// Определение допустимости нескольких значений атрибута
			if strings.Contains(a, "SINGLE-VALUE") {
				atribute.SINGLE_VALUE = true
			}

			// Определение возможности изменения атрибута пользователем
			if strings.Contains(a, "NO-USER-MODIFICATION") {
				atribute.USER_MODIFICATION = false
			} else {
				atribute.USER_MODIFICATION = true
			}

			// Опредеоени области применения атрибута
			if strings.Contains(a, "USAGE") {
				reUsage := regexp.MustCompile(`USAGE (directoryOperation|dSAOperation)`)
				matchedUsageString := reUsage.FindStringSubmatch(a)
				if len(matchedUsageString) >= 1 {
					atribute.USAGE = matchedUsageString[1]
				} else {
					atribute.USAGE = "userApplication"
				}
			} else {
				atribute.USAGE = "userApplication"
			}

			schema.Attributes = append(schema.Attributes, atribute)
		}

		objectClasses := v.GetAttributeValues("objectClasses")
		for _, o := range objectClasses {
			var objectClass ObjectClass

			// Поиск имени объект класса
			reName := regexp.MustCompile(`NAME '([0-9a-zA-Z_-]+?)'`)
			matchedNameString := reName.FindStringSubmatch(o)
			if len(matchedNameString) > 0 {
				objectClass.NAME = matchedNameString[1]
			}

			// Поиск описания объект класса
			reDesc := regexp.MustCompile(`DESC '(.*?)'`)
			matchedDescString := reDesc.FindStringSubmatch(o)
			if len(matchedDescString) > 0 {
				objectClass.DESC = matchedDescString[1]
			}

			// Поиск супер объект класса
			reSup := regexp.MustCompile(`SUP ([0-9a-zA-Z_-]+?) `)
			matchedSupString := reSup.FindStringSubmatch(o)
			if len(matchedSupString) > 0 {
				objectClass.SUP = matchedSupString[1]
			}

			// Определение является ли объект класс структурным
			if strings.Contains(o, "STRUCTURAL") {
				objectClass.STRUCTURAL = true
			}

			// Определение обязательных атрибутов
			reMust := regexp.MustCompile(`MUST ([0-9a-zA-Z_-]+? |\(.+?\))`)
			matchedMustString := reMust.FindString(o)
			if len(matchedMustString) > 0 {
				matchedMustArr := re3.FindAllStringSubmatch(matchedMustString, -1)
				if len(matchedMustArr) > 0 {
					for _, m := range matchedMustArr {
						objectClass.MUST = append(objectClass.MUST, m[1])
					}
				}
			}

			// Определение необязательных атрибутов
			reMay := regexp.MustCompile(`MAY ([0-9a-zA-Z_-]+? |\(.+?\))`)
			matchedMayString := reMay.FindString(o)
			if len(matchedMayString) > 0 {
				matchedMayArr := re3.FindAllStringSubmatch(matchedMayString, -1)
				if len(matchedMayArr) > 0 {
					for _, m := range matchedMayArr {
						objectClass.MAY = append(objectClass.MAY, m[1])
					}
				}
			}

			schema.ObjectClasses = append(schema.ObjectClasses, objectClass)

		}

		schema.NotParseObjectClasses = objectClasses
		schema.NotParseAttributes = attributeTypes
	}

	b, err := json.MarshalIndent(schema, "", "  ")
	if err != nil {
		fmt.Println("MARSHAL INDENT ", err.Error())
		return nil, err
	}

	file, err := os.Create("data.json")
	if err != nil {
		fmt.Println("CREATE FILE ", err.Error())
		return nil, err
	}

	file.Write(b)

	return schema, nil
}
