package gov.fda.nctr.arlims.data_access;


public class AuthenticatableUser
{
    private String username;
    private String password;

    public AuthenticatableUser(String username, String password)
    {
        this.username = username;
        this.password = password;
    }

    public String getUsername() { return username; }

    public String getPassword() { return password; }
}
