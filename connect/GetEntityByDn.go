package connect

import (
	"fmt"

	ldap "github.com/go-ldap/ldap/v3"
)

func GetEntityByDn(conn *ldap.Conn, baseDN string) (any, error) {

	// Search for the given username
	searchRequest := ldap.NewSearchRequest(
		baseDN,
		ldap.ScopeBaseObject, ldap.NeverDerefAliases, 0, 0, false,
		"(objectClass=*)", []string{"objectClass"}, nil,
	)

	sr, err := conn.Search(searchRequest)
	if err != nil {
		fmt.Println("CONN SEARCH ", err.Error())
		return nil, err
	}

	result := sr.Entries[0].GetAttributeValues("objectClass")

	fmt.Println(result)

	return result, nil
}
