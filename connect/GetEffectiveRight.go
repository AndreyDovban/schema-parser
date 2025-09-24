package connect

import (
	"fmt"
	"strings"

	ldap "github.com/go-ldap/ldap/v3"
)

type Right struct {
	Name  string `json:"name"`
	Value string `json:"value"`
}

type EffectiveRight struct {
	Dn                   string  `json:"dn"`
	EntryLevelRights     string  `json:"entry_level_rights"`
	AttributeLevelRights []Right `json:"attribute_level_rights"`
}

func GetEffectiveRight(
	conn *ldap.Conn,
	baseDN string,
	ObjectsForCheckRights string,
	ScopeForCheckRights bool,
) (any, error) {

	reqControl := ldap.NewControlString("1.3.6.1.4.1.42.2.27.9.5.2", true, "dn:"+ObjectsForCheckRights)

	scope := ldap.ScopeBaseObject
	if ScopeForCheckRights {
		scope = ldap.ScopeWholeSubtree
	}

	searchRequest := ldap.NewSearchRequest(
		baseDN,
		scope,
		ldap.NeverDerefAliases, 0, 0, false,
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
		var rights []Right

		effectiveRight.Dn = ent.DN
		entryLevelRights := ent.GetAttributeValue("entryLevelRights")

		if entryLevelRights == "" {
			entryLevelRights = "- - - -"
		}
		effectiveRight.EntryLevelRights = entryLevelRights

		str := strings.TrimSpace(ent.GetAttributeValue("attributeLevelRights"))
		arr := strings.Split(str, ",")
		for _, r := range arr {
			var right Right
			sub_arr := strings.Split(r, ":")
			if len(sub_arr) > 0 {
				right.Name = sub_arr[0]
			} else {
				right.Name = "UNNOWN NAME"
				right.Value = "UNNOWN VALUE"
			}
			if len(sub_arr) > 1 {
				right.Value = sub_arr[1]
			}
			rights = append(rights, right)
		}

		effectiveRight.AttributeLevelRights = rights

		listEffectiveRight = append(listEffectiveRight, effectiveRight)
	}

	return listEffectiveRight, nil
}
