package connect

import (
	"fmt"

	ldap "github.com/go-ldap/ldap/v3"
)

type EffectiveRight struct {
	Dn                   string
	EntryLevelRights     string
	AttributeLevelRights []string
}

func GetEffectiveRight(conn *ldap.Conn, baseDN string, ObjectsForCheckRights string) (any, error) {

	reqControl := ldap.NewControlString("1.3.6.1.4.1.42.2.27.9.5.2", true, "dn:"+ObjectsForCheckRights)

	searchRequest := ldap.NewSearchRequest(
		baseDN,
		ldap.ScopeWholeSubtree, ldap.NeverDerefAliases, 0, 0, false,
		"(objectClass=*)", []string{"*"}, []ldap.Control{reqControl},
	)

	sr, err := conn.Search(searchRequest)
	if err != nil {
		fmt.Println("CONN SEARCH ", err.Error())
		return nil, err
	}

	var listEffectiveRight []EffectiveRight
	for _, ent := range sr.Entries {
		var effectiveRight EffectiveRight

		effectiveRight.Dn = ent.DN
		effectiveRight.EntryLevelRights = ent.GetAttributeValue("entryLevelRights")
		effectiveRight.AttributeLevelRights = ent.GetAttributeValues("attributeLevelRights")

		listEffectiveRight = append(listEffectiveRight, effectiveRight)
	}

	return listEffectiveRight, nil
}
