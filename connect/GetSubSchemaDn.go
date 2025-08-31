package connect

import (
	"encoding/json"
	"fmt"
	"os"

	"test/store"

	ldap "github.com/go-ldap/ldap/v3"
)

func GetSubSchemaDn(conn *ldap.Conn, baseDN string) (any, error) {

	// Search for the given username
	searchRequest := ldap.NewSearchRequest(
		baseDN,
		ldap.ScopeBaseObject, ldap.NeverDerefAliases, 0, 0, false,
		"(objectClass=*)", []string{"subschemaSubentry"}, nil,
		// "(objectClass=*)", []string{"attributeTypes","objectClasses"}, nil,
	)

	sr, err := conn.Search(searchRequest)
	if err != nil {
		fmt.Println("CONN SEARCH ", err.Error())
		return nil, err
	}

	result := sr.Entries[0].Attributes[0].Values

	b, err := json.MarshalIndent(result[0], "", "  ")
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

	fmt.Println(result)
	store.BaseDn = result[0]

	return result[0], nil
}
