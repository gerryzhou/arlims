package gov.fda.nctr.arlims.models.dto;

import com.fasterxml.jackson.annotation.JsonAlias;


public class AppVersion
{
   @JsonAlias("git.build.time")
   private String buildTimestamp;

   @JsonAlias("git.build.user.email")
   private String buildUserEmail;

   @JsonAlias("git.build.user.name")
   private String buildUserName;

   @JsonAlias("git.commit.id.abbrev")
   private String commitId;

   @JsonAlias("git.commit.time")
   private String commitTimestamp;

   public AppVersion() {}

   public String getBuildTimestamp() { return buildTimestamp; }

   public String getBuildUserEmail() { return buildUserEmail; }

   public String getBuildUserName() { return buildUserName; }

   public String getCommitId() { return commitId; }

   public String getCommitTimestamp() { return commitTimestamp; }

   @Override
   public String toString()
   {
      return "{" +
          "buildTimestamp=" + buildTimestamp +
          ", buildUserEmail='" + buildUserEmail + '\'' +
          ", buildUserName='" + buildUserName + '\'' +
          ", commitId='" + commitId + '\'' +
          ", commitTimestamp=" + commitTimestamp +
          '}';
   }
}
