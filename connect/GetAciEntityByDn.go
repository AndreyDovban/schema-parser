package connect

import (
	"fmt"
	"regexp"
	"strings"

	ldap "github.com/go-ldap/ldap/v3"
)

type AciForEntity struct {
	Target     string   `json:"target"`
	TargetAttr []string `json:"targetattr"`
	Acl        string   `json:"acl"`
	Version    string   `json:"version"`
	Allow      []string `json:"allow"`
}

func GetAciEntityByDn(conn *ldap.Conn, baseDN string) (any, error) {

	listAciFoeEntity := []AciForEntity{}

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
	aci := sr.Entries[0].GetAttributeValues("aci")

	for _, a := range aci {

		var aciForEntity AciForEntity

		// Поиск target (налеливание на узел)
		reTarget := regexp.MustCompile(`target = "(.*?)"`)
		matchedTargetString := reTarget.FindStringSubmatch(a)
		if len(matchedTargetString) > 0 {
			aciForEntity.Target = matchedTargetString[1]
		}

		// Поиск target (влкюченные атрибуты)
		reTargetattr := regexp.MustCompile(`targetattr.*?"(.*?)"`)
		matchedTargetattrString := reTargetattr.FindStringSubmatch(a)
		if len(matchedTargetattrString) > 0 {
			str := strings.ReplaceAll(matchedTargetattrString[1], " ", "")
			aciForEntity.TargetAttr = strings.Split(str, "||")
		}

		// Поиск версии aci
		reVersion := regexp.MustCompile(`version (\d\.\d)`)
		matchedVersionString := reVersion.FindStringSubmatch(a)
		if len(matchedVersionString) > 0 {
			aciForEntity.Version = strings.TrimSpace(matchedVersionString[1])
		}

		// Поиск acl (название)
		reAcl := regexp.MustCompile(`acl "(.*?)"`)
		matchedAclString := reAcl.FindStringSubmatch(a)
		if len(matchedAclString) > 0 {
			aciForEntity.Acl = matchedAclString[1]
		}

		// Поиск версии allow ( предоставленные права )
		reAllow := regexp.MustCompile(`allow[\s]?\((.*?)\)`)
		matchedAllowString := reAllow.FindStringSubmatch(a)
		if len(matchedAllowString) > 0 {
			str := strings.ReplaceAll(matchedAllowString[1], " ", "")
			aciForEntity.Allow = strings.Split(str, ",")
		}

		listAciFoeEntity = append(listAciFoeEntity, aciForEntity)
	}

	return listAciFoeEntity, nil
}
