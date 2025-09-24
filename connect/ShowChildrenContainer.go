package connect

import (
	"fmt"

	ldap "github.com/go-ldap/ldap/v3"
)

type Child struct {
	Dn         string                `json:"dn"`
	Attributes []map[string][]string `json:"attributes"`
}

func ShowChildrenContainer(
	conn *ldap.Conn,
	baseDN string,

) (any, error) {

	// reqControl := ldap.NewControlString("1.3.6.1.4.1.42.2.27.9.5.2", true, "dn:"+ObjectsForCheckRights)

	searchRequest := ldap.NewSearchRequest(
		baseDN,
		ldap.ScopeSingleLevel,
		ldap.NeverDerefAliases, 0, 0, false,
		"(objectClass=*)", []string{"cn"},
		//  []ldap.Control{reqControl}
		nil,
	)

	sr, err := conn.Search(searchRequest)
	if err != nil {
		fmt.Println("CONN SEARCH ", err.Error())
		return nil, err
	}

	var listcatalog []Child
	for _, ent := range sr.Entries {
		var entry Child
		entry.Dn = ent.DN
		for _, attr := range ent.Attributes {
			entry.Attributes = append(entry.Attributes, map[string][]string{attr.Name: ent.GetAttributeValues(attr.Name)})
		}

		listcatalog = append(listcatalog, entry)
	}

	return listcatalog, nil
}
