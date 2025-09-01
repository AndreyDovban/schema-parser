package connect

import (
	"crypto/tls"
	"fmt"

	ldap "github.com/go-ldap/ldap/v3"
)

// Метод авторизации с использованием go-ldap с простой привязкой соеденения с базой данных
func LdapAuth(
	ldapServer, ldapPort, username, password string,
) (*ldap.Conn, error) {

	tlsConfig := &tls.Config{InsecureSkipVerify: true}

	fmt.Println("SERVER: ", ldapServer)
	fmt.Println("POST: ", ldapPort)

	conn, err := ldap.DialURL(ldapServer+":"+ldapPort, ldap.DialWithTLSConfig(tlsConfig))

	if err != nil {
		fmt.Println("LDAP DIAL URL ", err.Error())
		return nil, err
	}

	controls := []ldap.Control{}
	controls = append(controls, ldap.NewControlBeheraPasswordPolicy())
	bindRequest := ldap.NewSimpleBindRequest(username, password, controls)
	bindRequestSamba := ldap.NewSimpleBindRequest(username, password, controls)

	_, err = Conn.SimpleBind(bindRequest)

	if err != nil {
		_, err = conn.SimpleBind(bindRequestSamba)
		if err != nil {
			fmt.Println("CONN BIND ", err.Error())
			return conn, err
		} else {
			fmt.Println("Login Ok")
			return conn, err
		}
	} else {
		fmt.Println("Login Ok")
		return conn, err
	}
}
