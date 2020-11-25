exports.newGlobals = function newGlobals() {

    let thisObject = {
        initialize: initialize
    }

    return thisObject;

    function initialize() {

        /* Callbacks default responses. */
        global.DEFAULT_OK_RESPONSE = {
            result: "Ok",
            message: "Operation Succeeded"
        };

        global.DEFAULT_FAIL_RESPONSE = {
            result: "Fail",
            message: "Operation Failed"
        };

        global.DEFAULT_RETRY_RESPONSE = {
            result: "Retry",
            message: "Retry Later"
        };

        global.CUSTOM_OK_RESPONSE = {
            result: "Ok, but check Message",
            message: "Custom Message"
        };

        global.CUSTOM_FAIL_RESPONSE = {
            result: "Fail Because",
            message: "Custom Message"
        };

        /* This is the Execution Datetime */

        global.EXECUTION_DATETIME = new Date();

        /* Time Frames Definitions. */

        global.marketFilesPeriods =
            '[' +
            '[' + 24 * 60 * 60 * 1000 + ',' + '"24-hs"' + ']' + ',' +
            '[' + 12 * 60 * 60 * 1000 + ',' + '"12-hs"' + ']' + ',' +
            '[' + 8 * 60 * 60 * 1000 + ',' + '"08-hs"' + ']' + ',' +
            '[' + 6 * 60 * 60 * 1000 + ',' + '"06-hs"' + ']' + ',' +
            '[' + 4 * 60 * 60 * 1000 + ',' + '"04-hs"' + ']' + ',' +
            '[' + 3 * 60 * 60 * 1000 + ',' + '"03-hs"' + ']' + ',' +
            '[' + 2 * 60 * 60 * 1000 + ',' + '"02-hs"' + ']' + ',' +
            '[' + 1 * 60 * 60 * 1000 + ',' + '"01-hs"' + ']' + ']';

        global.marketFilesPeriods = JSON.parse(global.marketFilesPeriods);

        global.dailyFilePeriods =
            '[' +
            '[' + 45 * 60 * 1000 + ',' + '"45-min"' + ']' + ',' +
            '[' + 40 * 60 * 1000 + ',' + '"40-min"' + ']' + ',' +
            '[' + 30 * 60 * 1000 + ',' + '"30-min"' + ']' + ',' +
            '[' + 20 * 60 * 1000 + ',' + '"20-min"' + ']' + ',' +
            '[' + 15 * 60 * 1000 + ',' + '"15-min"' + ']' + ',' +
            '[' + 10 * 60 * 1000 + ',' + '"10-min"' + ']' + ',' +
            '[' + 05 * 60 * 1000 + ',' + '"05-min"' + ']' + ',' +
            '[' + 04 * 60 * 1000 + ',' + '"04-min"' + ']' + ',' +
            '[' + 03 * 60 * 1000 + ',' + '"03-min"' + ']' + ',' +
            '[' + 02 * 60 * 1000 + ',' + '"02-min"' + ']' + ',' +
            '[' + 01 * 60 * 1000 + ',' + '"01-min"' + ']' + ']';

        global.dailyFilePeriods = JSON.parse(global.dailyFilePeriods);

        global.ROOT_DIR = './';

        global.ONE_YEAR_IN_MILISECONDS = 365 * 24 * 60 * 60 * 1000
        global.ONE_DAY_IN_MILISECONDS = 24 * 60 * 60 * 1000
        global.ONE_MIN_IN_MILISECONDS = 60 * 1000
        global.LOGGER_MAP = new Map()   // We will put all the loggers in a map, so that we can eventually finalize them.
        global.SESSION_MAP = new Map()  // We will put all the sessions in a map, so that we can eventually finalize them.

        global.UNIQUE_ID = function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
                return v.toString(16)
            })
        }

        global.PRECISE = function (floatNumber, precision) {
            return this.parseFloat(floatNumber.toFixed(precision))
        }

        global.REMOVE_TIME = function (datetime) {
            const GMT_SECONDS = ':00.000 GMT+0000';
            let date = new Date(datetime)
            return new Date(date.getUTCFullYear() + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCDate() + " " + "00:00" + GMT_SECONDS);
        }

        global.PROCESS_ERROR = function (processKey, node, errorMessage) {
            let event
            if (node !== undefined) {
                event = {
                    nodeName: node.name,
                    nodeType: node.type,
                    nodeId: node.id,
                    errorMessage: errorMessage
                }
            } else {
                event = {
                    errorMessage: errorMessage
                }
            }
            global.EVENT_SERVER_CLIENT_MODULE.raiseEvent(processKey, 'Error', event)
        }

        global.PROCESS_WARNING = function (processKey, node, warningMessage) {
            let event
            if (node !== undefined) {
                event = {
                    nodeName: node.name,
                    nodeType: node.type,
                    nodeId: node.id,
                    warningMessage: warningMessage
                }
            } else {
                event = {
                    warningMessage: warningMessage
                }
            }
            global.EVENT_SERVER_CLIENT_MODULE.raiseEvent(processKey, 'Warning', event)
        }

        global.PROCESS_INFO = function (processKey, node, infoMessage) {
            let event
            if (node !== undefined) {
                event = {
                    nodeName: node.name,
                    nodeType: node.type,
                    nodeId: node.id,
                    infoMessage: infoMessage
                }
            } else {
                event = {
                    infoMessage: infoMessage
                }
            }
            global.EVENT_SERVER_CLIENT_MODULE.raiseEvent(processKey, 'Info', event)
        }

        global.NODE_BRANCH_TO_ARRAY = function (node, nodeType) {
            let resultArray = []
            scanNodeBranch(node, nodeType)
            return resultArray

            function scanNodeBranch(startingNode) {
                let nodeDefinition = global.APP_SCHEMA_MAP.get(startingNode.type)
                if (nodeDefinition === undefined) { return }

                if (startingNode.type === nodeType) {
                    resultArray.push(startingNode)
                    return
                }

                if (nodeDefinition.properties === undefined) { return }
                for (let i = 0; i < nodeDefinition.properties.length; i++) {
                    let property = nodeDefinition.properties[i]

                    switch (property.type) {
                        case 'node': {
                            scanNodeBranch(startingNode[property.name])
                        }
                            break
                        case 'array': {
                            let startingNodePropertyArray = startingNode[property.name]
                            if (startingNodePropertyArray !== undefined) {
                                for (let m = 0; m < startingNodePropertyArray.length; m++) {
                                    scanNodeBranch(startingNodePropertyArray[m])
                                }
                            }
                            break
                        }
                    }
                }
            }
        }

        global.FIND_NODE_IN_NODE_MESH = function (node, nodeType) {
            /*
            This function scans a node mesh for a certain node type and 
            returns the first instance found. 
            */
            let nodeFound
            scanNodeMesh(node, nodeType)
            return nodeFound

            function scanNodeMesh(startingNode) {
                if (startingNode === undefined) { return }
                if (nodeFound !== undefined) { return }

                let nodeDefinition = APP_SCHEMA_MAP.get(startingNode.type)
                if (nodeDefinition === undefined) { return }

                if (startingNode.type === nodeType) {
                    nodeFound = startingNode
                    return
                }

                /* We scan through this node children */
                if (nodeDefinition.properties !== undefined) {
                    for (let i = 0; i < nodeDefinition.properties.length; i++) {
                        let property = nodeDefinition.properties[i]

                        switch (property.type) {
                            case 'node': {
                                scanNodeMesh(startingNode[property.name])
                            }
                                break
                            case 'array': {
                                let startingNodePropertyArray = startingNode[property.name]
                                if (startingNodePropertyArray !== undefined) {
                                    for (let m = 0; m < startingNodePropertyArray.length; m++) {
                                        scanNodeMesh(startingNodePropertyArray[m])
                                    }
                                }
                                break
                            }
                        }
                    }
                }
                /* We scan parents nodes. */
                if (startingNode.parentNode !== undefined) {
                    scanNodeMesh(startingNode.parentNode)
                }
                /* We scan reference parents too. */
                if (startingNode.referenceParent !== undefined) {
                    scanNodeMesh(startingNode.referenceParent)
                }
            }
        }

        global.NODE_MESH_TO_PATH_ARRAY = function (node, nodeId) {
            /*
            This function scans a node mesh for a certain node if and 
            returns an array with the path within that mesh to the
            requested node. 
            */
            let nodeArray = []
            scanNodeMesh(node)
            return nodeArray

            function scanNodeMesh(startingNode) {
                if (startingNode === undefined) { return }

                let nodeDefinition = APP_SCHEMA_MAP.get(startingNode.type)
                if (nodeDefinition === undefined) { return }

                if (startingNode.id === nodeId) {
                    nodeArray.push(startingNode)
                    return
                }

                /* We scan through this node children */
                if (nodeDefinition.properties !== undefined) {
                    for (let i = 0; i < nodeDefinition.properties.length; i++) {
                        let property = nodeDefinition.properties[i]

                        switch (property.type) {
                            case 'node': {
                                scanNodeMesh(startingNode[property.name])
                                if (nodeArray.length > 0) {
                                    nodeArray.unshift(startingNode)
                                    return
                                }
                            }
                                break
                            case 'array': {
                                let startingNodePropertyArray = startingNode[property.name]
                                if (startingNodePropertyArray !== undefined) {
                                    for (let m = 0; m < startingNodePropertyArray.length; m++) {
                                        scanNodeMesh(startingNodePropertyArray[m])
                                        if (nodeArray.length > 0) {
                                            nodeArray.unshift(startingNode)
                                            return
                                        }
                                    }
                                }
                                break
                            }
                        }
                    }
                }
                /* We scan parents nodes. */
                if (startingNode.parentNode !== undefined) {
                    scanNodeMesh(startingNode.parentNode)
                    if (nodeArray.length > 0) {
                        nodeArray.unshift(startingNode)
                        return
                    }
                }
                /* We scan reference parents too. */
                if (startingNode.referenceParent !== undefined) {
                    scanNodeMesh(startingNode.referenceParent)
                    if (nodeArray.length > 0) {
                        nodeArray.unshift(startingNode)
                        return
                    }
                }
            }
        }

        global.FIND_NODE_IN_NODE_ARRAY = function (nodeArray, nodeType) {
            for (let i = 0; i < nodeArray.length; i++) {
                let node = nodeArray[i]
                if (node.type === nodeType) {
                    return node
                }
            }
        }

        global.FILTER_OUT_NODES_WITHOUT_REFERENCE_PARENT_FROM_NODE_ARRAY = function (nodeArray) {
            let filteredNodeArray = []
            for (let i = 0; i < nodeArray.length; i++) {
                let arrayItem = nodeArray[i]
                if (arrayItem.referenceParent === undefined) {
                    continue
                } else {
                    filteredNodeArray.push(arrayItem)
                }
            }
            return filteredNodeArray
        }

        global.EMIT_SESSION_STATUS = function (status, key) {
            switch (status) {
                case 'Running': {
                    global.EVENT_SERVER_CLIENT_MODULE.raiseEvent(key, 'Running')
                    break
                }
                case 'Stopped': {
                    global.EVENT_SERVER_CLIENT_MODULE.raiseEvent(key, 'Stopped')
                    break
                }
            }
        }


        global.FINALIZE_LOGGERS = function () {
            global.LOGGER_MAP.forEach(forEachLogger)

            function forEachLogger(logger) {
                if (logger !== undefined) {
                    logger.finalize()
                }
            }
        }

        global.FINALIZE_SESSIONS = function () {
            global.SESSION_MAP.forEach(forEachSession)

            function forEachSession(session) {
                global.EVENT_SERVER_CLIENT_MODULE.raiseEvent(session, 'Stopped')
            }
        }

        global.SHUTTING_DOWN_PROCESS = false

        global.EXIT_NODE_PROCESS = function exitProcess() {

            if (global.unexpectedError !== undefined) {
                global.taskError(undefined, "An unexpected error caused the Task to stop.")
            }

            if (global.SHUTTING_DOWN_PROCESS === true) { return }
            global.SHUTTING_DOWN_PROCESS = true

            /* Signal that all sessions are stopping. */
            global.FINALIZE_SESSIONS()

            /* Cleaning Before Exiting. */
            clearInterval(global.HEARTBEAT_INTERVAL_HANDLER)

            if (global.TASK_NODE !== undefined) {
                for (let i = 0; i < global.TASK_NODE.bot.processes.length; i++) {
                    let config = global.TASK_NODE.bot.processes[i].config
                    let process = global.TASK_NODE.bot.processes[i]

                    let key = process.name + '-' + process.type + '-' + process.id
                    global.EVENT_SERVER_CLIENT_MODULE.raiseEvent(key, 'Stopped') // Meaning Process Stopped
                }
            }

            global.FINALIZE_LOGGERS()
            //console.log("[INFO] Task Server -> " + global.TASK_NODE.name + " -> EXIT_NODE_PROCESS -> Task Server will stop in 10 seconds.");

            setTimeout(process.exit, 10000) // We will give 10 seconds to logs be written on file
        }

        require('dotenv').config();

        global.WRITE_LOGS_TO_FILES = process.env.WRITE_LOGS_TO_FILES

        /*
        We need to count how many process instances we deployd and how many of them have already finished their job, either
        because they just finished or because there was a request to stop the proceses. In this way, once we reach the
        amount of instances started, we can safelly destroy the rest of the objects running and let this nodejs process die.
        */

        global.ENDED_PROCESSES_COUNTER = 0
        global.TOTAL_PROCESS_INSTANCES_CREATED = 0

        global.STOP_TASK_GRACEFULLY = false;

        global.getPercentage = function (fromDate, currentDate, lastDate) {
            let fromDays = Math.trunc(fromDate.valueOf() / global.ONE_DAY_IN_MILISECONDS)
            let currentDays = Math.trunc(currentDate.valueOf() / global.ONE_DAY_IN_MILISECONDS)
            let lastDays = Math.trunc(lastDate.valueOf() / global.ONE_DAY_IN_MILISECONDS)
            let percentage = (currentDays - fromDays) * 100 / (lastDays - fromDays)
            if ((lastDays - fromDays) === 0) {
                percentage = 100
            }
            return percentage
        }
        
        global.areEqualDates = function (date1, date2) {
            let day1Days = Math.trunc(date1.valueOf() / global.ONE_DAY_IN_MILISECONDS)
            let day2Days = Math.trunc(date2.valueOf() / global.ONE_DAY_IN_MILISECONDS)
        
            if (day1Days === day2Days) {
                return true
            } else {
                return false
            }
        }
    }
}