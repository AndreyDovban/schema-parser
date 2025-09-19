package connect

import (
	"fmt"

	ldap "github.com/go-ldap/ldap/v3"
)

type IPermission struct {
	Cn                  []string `json:"cn"`
	IpaPermBindRuleType []string `json:"ipa_perm_bind_rule_type"`
	IpaPermIncludedAttr []string `json:"ipa_perm_included_attr"`
	IpaPermLocation     []string `json:"ipa_perm_location"`
	IpaPermRight        []string `json:"ipa_perm_right"`
	IpaPermTarget       []string `json:"ipa_perm_target"`
	IpaPermissionType   []string `json:"ipa_permission_type"`
}

func GetListPermissions(conn *ldap.Conn, baseDN string) (any, error) {

	// Search for the given username
	searchRequest := ldap.NewSearchRequest(
		baseDN,
		ldap.ScopeSingleLevel, ldap.NeverDerefAliases, 0, 0, false,
		"(objectClass=*)", []string{
			"cn",
			"ipaPermBindRuleType",
			"ipaPermIncludedAttr",
			"ipaPermLocation",
			"ipaPermRight",
			"ipaPermTarget",
			"ipaPermissionType"}, nil,
	)

	sr, err := conn.Search(searchRequest)
	if err != nil {
		fmt.Println("CONN SEARCH ", err.Error())
		return nil, err
	}

	listPermissions := []IPermission{}
	entires := sr.Entries
	for _, elem := range entires {
		var permission IPermission

		// Получение названия
		cn := elem.GetAttributeValues("cn")
		permission.Cn = cn

		// Получение IpaPermBindRuleType
		IpaPermBindRuleType := elem.GetAttributeValues("ipaPermBindRuleType")
		permission.IpaPermBindRuleType = IpaPermBindRuleType

		// Получение IpaPermIncludedAttr
		IpaPermIncludedAttr := elem.GetAttributeValues("ipaPermIncludedAttr")
		permission.IpaPermIncludedAttr = IpaPermIncludedAttr

		// Получение IpaPermLocation
		IpaPermLocation := elem.GetAttributeValues("ipaPermLocation")
		permission.IpaPermLocation = IpaPermLocation

		// Получение IpaPermRight
		IpaPermRight := elem.GetAttributeValues("ipaPermRight")
		permission.IpaPermRight = IpaPermRight

		// Получение IpaPermTarget
		IpaPermTarget := elem.GetAttributeValues("ipaPermTarget")
		permission.IpaPermTarget = IpaPermTarget

		// Получение IpaPermissionType
		IpaPermissionType := elem.GetAttributeValues("ipaPermissionType")
		permission.IpaPermissionType = IpaPermissionType

		listPermissions = append(listPermissions, permission)

	}

	return listPermissions, nil
}
