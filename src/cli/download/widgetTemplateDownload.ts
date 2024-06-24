#!/usr/bin/env node
import path from 'path';

import { Command } from 'commander';
import inquirer from 'inquirer';

import { log, messages } from '../../messages';
import { getAllWidgets } from '../../services/api/widget';
import downloadWidgetTemplate from '../../services/widgetTemplate/download';
import { Widget } from '../../types';

const widgetTemplateDownload = () => {
    const program = new Command('download');

    return program
        .arguments('[widget-name]')
        .description('Select your widget template to download')
        .usage('Select name')
        .action((widgetName) => {
            const widgetDir = path.resolve('.');
            getAllWidgets().then(async (widgets) => {
                const downloaded = await widgetTemplateDownloadWithName(widgetName, widgets, widgetDir);
                if (downloaded) return;
                const question = [
                    {
                        type: 'list',
                        messages: 'Select your widget template to download',
                        name: 'widgetTemplate',
                        choices: widgets.map((widget) => ({
                            name: widget.name,
                            value: widget,
                        })),
                    },
                ];
                inquirer.prompt(question).then((answer) => {
                    downloadWidgetTemplate(answer.widgetTemplate, widgetDir);
                });
            });
        });
};

const widgetTemplateDownloadWithName = async (
    widgetName: string,
    widgets: Widget[],
    widgetDir: string,
): Promise<boolean> => {
    if (!widgetName) return false;
    const widget = widgets.find((widget) => widget.name === widgetName);
    if (!widget) {
        log.error(messages.widgetDownload.notFound);
        return false;
    }
    await downloadWidgetTemplate(widget, widgetDir);
    return true;
};

export default widgetTemplateDownload;
