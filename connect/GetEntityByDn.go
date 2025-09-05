package connect

import (
	"fmt"
	"strings"

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
	for i, str := range result {
		result[i] = strings.ToLower(str)
	}

	return result, nil
}
