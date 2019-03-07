package gov.fda.nctr.arlims.models.dto;


import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonFormat;

public class AppVersion
{
   @JsonAlias("git.build.time")
   @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ssZ", timezone = "UTC")
   private Instant buildTimestamp;

   @JsonAlias("git.build.user.email")
   private String buildUserEmail;

   @JsonAlias("git.build.user.name")
   private String buildUserName;

   @JsonAlias("git.commit.id.abbrev")
   private String commitId;

   @JsonAlias("git.commit.time")
   @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ssZ", timezone = "UTC")
   private Instant commitTimestamp;

   public AppVersion() {}

   public Instant getBuildTimestamp() { return buildTimestamp; }

   public String getBuildUserEmail() { return buildUserEmail; }

   public String getBuildUserName() { return buildUserName; }

   public String getCommitId() { return commitId; }

   public Instant getCommitTimestamp() { return commitTimestamp; }

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
