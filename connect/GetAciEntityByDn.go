package connect

import (
	"fmt"

	ldap "github.com/go-ldap/ldap/v3"
)

func GetAciEntityByDn(conn *ldap.Conn, baseDN string) (any, error) {

	// Search for the given username
	searchRequest := ldap.NewSearchRequest(
		baseDN,
		ldap.ScopeBaseObject, ldap.NeverDerefAliases, 0, 0, false,
		"(objectClass=*)", []string{"aci"}, nil,
	)

	sr, err := conn.Search(searchRequest)
	if err != nil {
		fmt.Println("CONN SEARCH ", err.Error())
		return nil, err
	}
	result := sr.Entries[0].GetAttributeValues("aci")

	return result, nil
}
