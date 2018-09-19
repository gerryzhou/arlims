package gov.fda.nctr.arlims.data_access.facts;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.scheduling.annotation.SchedulingConfigurer;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.scheduling.config.ScheduledTaskRegistrar;
import org.springframework.stereotype.Service;

import gov.fda.nctr.arlims.data_access.ServiceBase;
import gov.fda.nctr.arlims.data_access.facts.models.dto.InboxItem;


@Service
public class ScheduledTasksService extends ServiceBase implements SchedulingConfigurer
{
    private FactsService factsService;
    private int threadPoolSize;

    public ScheduledTasksService
        (
            FactsService factsService,
            @Value("${facts.scheduling.thread-pool-size:5}") int threadPoolSize
        )
    {
        this.factsService = factsService;
        this.threadPoolSize = threadPoolSize;
    }

    @Override
    public void configureTasks(ScheduledTaskRegistrar scheduledTaskRegistrar)
    {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();

        scheduler.setPoolSize(threadPoolSize);

        log.info("Reserving " + threadPoolSize + " threads for FACTS scheduling.");

        scheduler.setThreadNamePrefix("facts-scheduler-");

        scheduler.initialize();

        scheduledTaskRegistrar.setTaskScheduler(scheduler);
    }


    @Scheduled(cron = "${facts.scheduling.sample-refresh.cron}")
    public void refreshSamples()
    {
        List<InboxItem> inboxItems = factsService.getLabInboxItems();

        log.info("[scheduled task] refreshSamples(): got inbox items: " + inboxItems);

        // TODO: Update tables from retrieved inbox items.
    }
}
