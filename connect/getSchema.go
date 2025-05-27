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
	NAME         []string
	SINGLE_VALUE bool
	USAGE        string
	DESC         string
}

type Schema struct {
	Attributes []Attribute `json:"attributes"`
}

func GetSchema(conn *ldap.Conn, baseDN string) (*Schema, error) {

	// Search for the given username
	searchRequest := ldap.NewSearchRequest(
		baseDN,
		ldap.ScopeBaseObject, ldap.NeverDerefAliases, 0, 0, false,
		"(objectClass=*)", []string{"attributeTypes"}, nil,
	)

	sr, err := conn.Search(searchRequest)
	if err != nil {
		fmt.Println("1111")
		return nil, err
	}

	re2 := regexp.MustCompile(`'(.+?)'`)

	schema := &Schema{}

	for _, v := range sr.Entries {
		attributeTypes := v.GetAttributeValues("attributeTypes")
		for _, a := range attributeTypes {

			var atribute Attribute
			// names := []string{}

			// Поиск имени атрибута
			reName := regexp.MustCompile(`NAME ('.+?'|\(.+?\))`)
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
			reDesc := regexp.MustCompile(`DESC '(.+?)'`)
			matchedDescString := reDesc.FindStringSubmatch(a)
			if len(matchedDescString) > 0 {
				atribute.DESC = matchedDescString[1]
			}

			// Определение допустимости нескольких значений атрибута
			if strings.Contains(a, "SINGLE-VALUE") {
				atribute.SINGLE_VALUE = true
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
	}

	b, err := json.MarshalIndent(schema, "", "  ")
	if err != nil {
		return nil, err
	}

	file, err := os.Create("data.json")
	if err != nil {
		return nil, err
	}

	file.Write(b)

	return schema, nil
}
